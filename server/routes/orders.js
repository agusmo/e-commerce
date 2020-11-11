const express = require("express");
const router = express.Router();

const { Product, Order, Order_Product } = require("../db/models");

//GET COMPLETED ORDERS

router.get("/completed", (req, res, next) => {
  console.log("ACA ESTA EL USER LOG", req.user.id);
  Order.findAll({
    where: { userId: req.user.id, status: "Completado" },
  }).then((orders) => res.send(orders));
});
// http://localhost:1337/api/orders    //  POST
router.post("/", (req, res, next) => {
  Order.create(req.body)
    .then((order) => res.send(order))
    .catch((err) => next(err));
});

// busca todos los productos asociados a una orden
//http://localhost:1337/api/orders/:orderId   // GET
router.get("/:orderId", (req, res, next) => {
  Order_Product.findAll({
    where: { orderId: req.params.orderId },
    include: Product,
    order: [["id", "DESC"]],
  })
    .then((products) => res.send(products))
    .catch((err) => next(err));
});

// http://localhost:1337/api/orders/user  // PUT (REGISTER)
router.get("/user/:userId", (req, res, next) => {
  // const userId = req.user.id
  const { userId } = req.params;
  // const { orderId } = req.body;
  Order.findOrCreate({
    where: {
      userId,
      status: "Pendiente",
      paymentMethod: "Efectivo",
      shippingAdress: "cualquiera",
    },
    // include: Order_Product,
  }).then((order) => res.send(order[0]));
  // Order.findByPk(orderId)
  //   .then((order) => {
  //     return order.setUser(userId);
  //   })
  //   .then((order) => res.send(order));
});

// http://localhost:1337/api/orders/user //  GET (LOGIN)
// router.get("/user", (req, res, next) => {
//   // const userId = req.user.id
//   console.log("aca");
//   const { userId } = req.body;
//   Order.findOne({
//     where: { userId: userId, status: "Pendiente" },
//   }).then((order) => res.send(order));
// });

// POST  (tiene que recibir producto)
router.post("/:productId", (req, res, next) => {
  const { userId } = req.body;
  const quantity = req.body.cantidad ? req.body.cantidad : 1;
  const { productId } = req.params;
  Order.findOrCreate({
    where: {
      userId,
      status: "Pendiente",
      paymentMethod: "Efectivo",
      shippingAdress: "cualquiera",
    },
  }).then((order) => {
    const product = Product.findByPk(productId);
    return product.then((product) => {
      return product
        .update({ stock: product.stock - quantity })
        .then(() =>
          Order_Product.findOrCreate({
            where: { productId: product.id, orderId: order[0].id },
          })
        )
        .then((orderProduct) =>
          orderProduct[0].update({ total: orderProduct[0].total + 1 })
        )
        .then(() => res.send(order[0]));
    });
  });
});

// DELETE ITEM FROM CART
router.delete("/:userId/:productId", (req, res, next) => {
  const { productId, userId } = req.params;
  console.log("ACA EL REQ USER", req.body);
  /* const { userId } = req.body; */

  Order.findOne({ where: { userId: userId, status: "Pendiente" } })
    .then((order) => {
      console.log(order);
      Order_Product.findOne({
        where: { orderId: order.id, productId: productId },
      }).then((orderProduct) =>
        Product.findByPk(productId).then((product) =>
          product.update({ stock: orderProduct.total + product.stock })
        )
      );
      return Order_Product.destroy({
        where: { orderId: order.id, productId: productId },
      });
    })
    .then(() => res.sendStatus(200));
});

// DELETE ENTIRE CART
router.delete("/:orderId", (req, res, next) => {
  Order.destroy({
    where: { userId: req.user.id, status: "Pendiente" },
  }).then(() => res.sendStatus(200));
});
// UPDATE ORDER
router.put("/cartId", (req, res, next) => {
  Order.findOne({ where: { userId: req.user.id, status: "Pendiente" } }).then(
    (order) => {
      order.update({ status: "Completado" });
    }
  );
});

// MODIFIES THE AMOUNT OF BOOKS OF AN ITEM
router.put("/:orderId/:productId", (req, res, next) => {
  Order_Product.findOne({
    where: {
      orderId: req.params.orderId,
      productId: req.params.productId,
    },
  })
    .then((orderProduct) => {
      const product = Product.findByPk(req.params.productId);
      return product.then((product) => {
        if (req.body.op === "suma") {
          return product
            .update({ stock: product.stock - 1 })
            .then(() => orderProduct.update({ total: orderProduct.total + 1 }));
        } else {
          return product
            .update({ stock: product.stock + 1 })
            .then(() => orderProduct.update({ total: orderProduct.total - 1 }));
          /* .then(() => Order.findOne({ where: { id: orderProduct.orderId } }))
            .then((order) => order.update({total: })); */
        }
      });
    })
    .then(() => res.sendStatus(200));
});

router.post("/newOrder/:userId", (req, res, next) => {
  if (!req.user) return;
  console.log("BODY EN NEW ORDER", req.body);
  return Order.findOrCreate({
    where: {
      userId: req.params.userId,
      status: "Pendiente",
      paymentMethod: "Efectivo",
      shippingAdress: "cualquiera",
    },
  }).then((foundOrder) => {
    console.log("FOUNDORDER", foundOrder);
    if (!foundOrder[1]) {
      return res.send(foundOrder[0]);
    } else {
      const newArray = req.body.productsArray.map((product) => {
        return {
          productId: product.id,
          orderId: foundOrder[0].id,
          total: product.total,
        };
      });
      Order_Product.bulkCreate(newArray).then((orderWithProducts) => {
        console.log("LA NUEVA ORDEN", orderWithProducts);
        res.sendStatus(201);
      });
    }
  });
});

router.put("/newOrder/product/:productId", (req, res, next) => {
  Product.findByPk(req.params.productId)
    .then((product) => {
      if (req.body.op === "suma") {
        return product.update({ stock: product.stock - 1 });
      } else {
        return product.update({ stock: product.stock + 1 });
      }
    })
    .then(() => res.sendStatus(200));
});

router.get("/", (req, res, next) => {
  Order.findAll({})
    .then((orders) => res.send(orders))
    .catch((err) => console.log(err));
});

module.exports = router;

// restar al product la cantidad que viene en el body, sumarlo a la order
// y actualizar la entrada en ambas tablas (Order_Product y Product).
// if (order.hasProduct(product)) modificar la entrada en la tabla pivot
// else: (hacer lo que sigue)

// VERSION VIEJA, FUNCIONABA ASI

// router.post("/:productId", (req, res, next) => {
//   const { productId } = req.params;
//   const { userId } = req.body;
//   Order.findOrCreate({
//     where: {
//       userId,
//       status: "Pendiente",
//       paymentMethod: "Efectivo",
//       shippingAdress: "cualquiera",
//     },
//   })
//     .then((order) => {
//       const product = Product.findByPk(productId);
//       return product.then((product) => {
//         // restar al product la cantidad que viene en el bosumarlo a la order
//         // y actualizar la entrada en ambas tablas (Order_ProducProduct).
//         // if (order.hasProduct(product)) modificar la entradala tabla pivot
//         // else: (hacer lo que sigue)
//         product.addOrder(order[0].id);
//         return order[0];
//       });
//     })
//     .then((order) => {
//       res.send(order);
//     });
// });
