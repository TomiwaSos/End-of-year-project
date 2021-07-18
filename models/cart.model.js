module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function (item, id,size) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {
                item: item,
                qty: 0,
                price: 0,
                id: id,
                size:size
            };
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    this.minus = function (id) {
        var storedItem = this.items[id];
        storedItem.qty--;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty--;
        this.totalPrice -= storedItem.item.price;

        if (storedItem.qty == 0) {
            this.delete(id);
        }
    };

    this.delete = function (id) {
        var storedItem = this.items[id];
        if (storedItem) {
            this.items[id] = this.items[null]
        };
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty -= storedItem.qty;
        this.totalPrice -= storedItem.price;
    }

    this.printTp = function () {
        var tp = this.totalPrice;
        return tp;
    }

    this.printItems = function () {
        var items = this.items;
        return items;
    }

    this.orderItems = function () {
        var items = this.items;
        return items;
    }

    this.size = function () {
        var size = this.size;
        return size;
    }

    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            var storedItem = this.items[id];
            arr.push({ item: storedItem.item.title, qty: storedItem.qty, price: storedItem.price ,size:storedItem.size});
        }
       
        return arr;
       
    };



    this.basketQty = function () {
        var quantity = [];
        for (var id in this.items) {
            var storedItem = this.items[id];
            quantity.push(storedItem.qty);
        }
       var number= 0;
        for ( i = 0 ; i < quantity.length;i++){
            number = number + quantity[i];
            
        }
        return number;
    };

    this.printId = function () {
        var ids = [];
        for (var id in this.items) {
            var storedItem = this.items[id];
            ids.push({id:storedItem.id, qty:storedItem.qty});
        }
  
        return ids;
    };

    
    this.qty = function () {
        var qty = this.totalQty;
        this.totalQty = oldCart.totalQty;
        return qty;
    };

    this.oTotalPrice = function () {
        var tp = this.totalPrice;
        return tp;
    }

    this.clearBasket = function () {
        for (var id in this.items) {
            this.items[id] = this.items[null]
        }
        this.totalQty = 0;
        this.totalPrice = 0;
    };


};