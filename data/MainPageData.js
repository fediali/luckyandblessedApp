var _categoryList = [
    { id:0, name: "All" }, 
    { id:1, name: "Women's" }, 
    { id:2, name: "Plus" }, 
    { id:3, name: "Footwear" }, 
    { id:4, name: "Men" }, 
    { id:5, name: "Tops" }, 
    { id:6, name: "Bottoms" }
]

var _collections = [
    {id:0, name: "New Collection", imageUrl: require("../static/collection1.png")}, 
    {id:1, name: "Summer Sale", imageUrl: require("../static/collection2.png")}, 
    {id:2, name: "Summer Sale", imageUrl: require("../static/collection2.png")}
]

var _newArrivals = [
    {
        id: 0,
        name: "Falcon Clear Pink",
        type: "Sneakers",
        price: 70.00,
        imageUrl: require("../static/new1.png")
    },
    {
        id: 1,
        name: "Essentials Linear",
        type: "Hoodies",
        price: 67.45,
        imageUrl: require("../static/new2.png")
    },
    {
        id: 2,
        name: "Own The Run Tee",
        type: "T-Shirts",
        price: 35.99,
        imageUrl: require("../static/new3.png")
    },
    {
        id: 3,
        name: "Ultimate 365",
        type: "Shorts",
        price: 52.50,
        imageUrl: require("../static/new4.png")
    },
]

var _trending = [
    {
        id: 0,
        name: "VFA Boost",
        type: "Backpacks",
        price: 53.00
    },
    {
        id: 1,
        name: "Wangbody Run",
        type: "Sneakers",
        price: 220.50
    },
    {
        id: 2,
        name: "Falcon Zip",
        type: "Sneakers",
        price: 119.99
    },
    {
        id: 3,
        name: "Wangbody Run",
        type: "Sneakers",
        price: 220.50
    },
    {
        id: 4,
        name: "Falcon Zip",
        type: "Sneakers",
        price: 119.99
    }, {
        id: 5,
        name: "VFA Boost",
        type: "Backpacks",
        price: 53.00
    },
]

var _history = [
    {
        id: 0,
        name: "VFA Boost",
        type: "Backpacks",
        price: 53.00,
        imageUrl: require("../static/recent1.png")
    },
    {
        id: 1,
        name: "Wangbody Run",
        type: "Sneakers",
        price: 220.50,
        imageUrl: require("../static/recent2.png")
    },
    {
        id: 2,
        name: "Falcon Zip",
        type: "Sneakers",
        price: 119.99,
        imageUrl: require("../static/recent3.png")
    },
    {
        id: 3,
        name: "Wangbody Run",
        type: "Sneakers",
        price: 220.50,
        imageUrl: require("../static/recent1.png")
    },
    {
        id: 4,
        name: "Falcon Zip",
        type: "Sneakers",
        price: 119.99,
        imageUrl: require("../static/recent2.png")
    }, {
        id: 5,
        name: "VFA Boost",
        type: "Backpacks",
        price: 53.00,
        imageUrl: require("../static/recent3.png")
    },
]

module.exports = { _categoryList, _collections, _newArrivals, _trending, _history }