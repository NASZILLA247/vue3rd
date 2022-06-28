var webstore = new Vue({
    el: '#app',
    data: {
        showProduct: true,
        lowHigh: 'Ascending',
        lessons: [],
        cart: [],
        searchInput: "",
        sortBy: '',
        firstName: "",
        lastName: "",
        phoneNumber: ""
    },
    methods: {
        getLessons: function () {
            fetch("https://idifavour-cst2.herokuapp.com/collection/lessons")
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    this.lessons = data
                })

                .catch(err => {
                    lessons = "unable to get lessons data"
                    console.log("unable to get lessons list")
                })
        },
        showCheckout() {
            this.showProduct = this.showProduct ? false : true;
        },
        addToCart(lesson) {
            if (lesson.stock >= 1) {
                let InCart = false
                if (this.cartCount() >= 1) {
                    for (let i = 0; i < this.cart.length; i++) {
                        if (this.cart[i].id == lesson._id) {
                            this.cart[i].stock += 1
                            InCart = true
                            break
                        }
                    }
                    if (InCart == false) {
                        let item = {}
                        item.id = lesson._id
                        item.stock = 1
                        this.cart.push(item)
                    }
                }
                else {
                    let item = {}
                    item.id = lesson._id
                    item.stock = 1
                    this.cart.push(item)
                }
                lesson.stock -= 1
            }
            else {
                lesson.stock = 0
            }
            console.log(this.cart)
        },
        checkOutItems() {
            let cartInfo = []
            for (let i = 0; i < this.cart.length; i++) {
                for (let k = 0; k < this.lessons.length; k++) {
                    if (this.lessons[k]._id == this.cart[i].id) {
                        let item = {}
                        item.id = this.cart[i].id
                        item.title = this.lessons[k].title
                        item.location = this.lessons[k].location
                        item.price = this.lessons[k].price
                        item.images = this.lessons[k].images
                        item.stock = this.cart[i].stock
                        cartInfo.push(item)
                    }
                }
            }
            return cartInfo
        },
        removeCartItem(id, stock) {
            let showcart = this.cart
            let less = this.lessons
            for (let i = 0; i < showcart.length; i++) {
                console.log(showcart[i].id)
                if (id == showcart[i].id) {
                    showcart.splice(i, 1)

                }
            }
            for (let i = 0; i < less.length; i++) {
                console.log(less[i].id)
                if (id == less[i]._id) {
                    less[i].stock += stock

                }
            }
        },
        checkOut(){
            let order = {
                name: this.firstName +' '+this.lastName,
                phone_number: this.phoneNumber,
                items: this.cart
            }
            let order_string = (JSON.stringify(order))
            fetch('https://idifavour-cst2.herokuapp.com/collection/orders', {
                method: "POST",
                body: order_string,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(response => response.json())
            .then(json_response => {
                console.log(json_response)
                this.placeOrder()
            })
            .catch(err => console.log(err))
        },
        placeOrder() {
            let stockNew = []
            let showcart = this.cart
            
            for (let i = 0; i < showcart.length; i++) {
                for (let j = 0; j < this.lessons.length; j++) {
                    if (showcart[i].id == this.lessons[j]._id) {
                        let item = {
                            id: showcart[i].id,
                            stock: this.lessons[j].stock
                        }
                        stockNew.push(item)
                    }
                }
            }
            let stockString = (JSON.stringify(stockNew))
            fetch('https://idifavour-cst2.herokuapp.com/collection/lessons', {
                method: "PUT",
                body: stockString,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    Swal.fire(
                        'Success!',
                        'Order submitted successfully!',
                        'success'
                    )
                    this.firstName = ''
                    this.lastName = ''
                    this.phoneNumber = ''
                    showcart.splice(0, showcart.length)
                })
                .catch(err => console.log(err))
            if (this.firstName == '' && this.lastName == '' && this.phoneNumber == '' && this.cart.length == 0) {
                Swal.fire(
                    'Error!',
                    'Fill all details!',
                    'Error'
                )
            }
            
        },
        searchFilter: function () {
            fetch(`https://idifavour-cst2.herokuapp.com/collection/lessons/search?filter=${this.searchInput}`)
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    this.lessons = data
                })
                .catch(err => {
                    this.lessons = []
                    console.log(`unable to get lessons: ${err}`)
                })
        },
        cartCount() {
            return this.cart.length
        },
        sortByPrice: function (priceArray) {
            function compare(a, b) {
                if (a.price > b.price)
                    return 1;
                if (a.price < b.price)
                    return -1;
                return 0;
            }
            return priceArray.sort(compare);
        },
        sortBySubject: function (subjectArray) {
            function compare(a, b) {
                if (a.subject > b.subject)
                    return 1;
                if (a.subject < b.subject)
                    return -1;
                return 0;
            }
            return subjectArray.sort(compare);
        },
        sortByLocation: function (locationArray) {
            function compare(a, b) {
                if (a.location > b.location)
                    return 1;
                if (a.location < b.location)
                    return -1;
                return 0;
            }
            return locationArray.sort(compare);
        },
        sortByAva: function (avaArray) {
            function compare(a, b) {
                if (a.stock > b.stock)
                    return 1;
                if (a.stock < b.stock)
                    return -1;
                return 0;
            }
            return avaArray.sort(compare);
        },

        filterLessons: function () {
            let tempLessons = this.lessons

            // tempLessons = tempLessons.filter((lesson) => {
            //     return lesson.subject.toLowerCase().match(this.searchInput.toLowerCase()) || lesson.location.toLowerCase().match(this.searchInput.toLowerCase())
            // })
            if (this.sortBy == 'price') {
                tempLessons = this.sortByPrice(tempLessons)
            }
            else if (this.sortBy == 'subject') {
                tempLessons = this.sortBySubject(tempLessons)
            }
            else if (this.sortBy == 'location') {
                tempLessons = this.sortByLocation(tempLessons)
            }
            else if (this.sortBy == 'stock') {
                tempLessons = this.sortByAva(tempLessons)
            }
            else{
                tempLessons = this.sortBySubject(tempLessons)
            }

            if (this.lowHigh == 'Ascending') {
                return tempLessons
            }
            else if (this.lowHigh == 'Descending') {
                return tempLessons.reverse()
            }
            return tempLessons
        }

    },
    computed: {
        cartItemCount: function () {
            return this.cart.length
        },
    },
    created() {
        this.getLessons()
    }
});
