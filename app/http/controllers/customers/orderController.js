const Order = require('../../../../models/order')
const moment = require('moment');
const { cache } = require('ejs');

module.exports.store = function(req, res){
    // Validate request
    const {phone, address} = req.body
    if(!phone || !address) {
        req.flash('error', 'All fields are required')
        return res.redirect('/cart')
    }

    const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone: phone,
        address: address
    })

    order.save().then(result => {
        Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
            req.flash('success', 'Order Placed Successfully')
            delete req.session.cart
            // Emit
            const eventEmitter = req.app.get('eventEmitter')
            eventEmitter.emit('orderPlaced', placedOrder)
            return res.redirect('/customer/orders')
        })
    }).catch(err => {
        req.flash('error', 'Something went wrong')
        return res.redirect('/cart')
    })
}

module.exports.custm = async function(req, res){
    const orders = await Order.find({ customerId: req.user._id }, 
    null,
    { sort: { 'createdAt': -1 }}); 
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0') 
    res.render('customers/orders', { orders: orders, moment: moment});
}

module.exports.show = async function(req, res){
    const order = await Order.findById(req.params.id)
    if(req.user._id.toString() === order.customerId.toString()){
        return res.render('customers/singleOrder', {order: order})
    }
    return res.redirect('/')
}