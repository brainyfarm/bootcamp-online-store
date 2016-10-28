const db = require('../helpers/firebase').database();

function getStoreInfo(storeLink) {
  const ref = db.ref('/');
  const userStoreRef = ref.child(`stores/${storeLink}`);

  return userStoreRef.once("value")
    .then((snapshot)=> {
      if (!snapshot.val()) {
        return null;
      };

      const storeName = snapshot.val().storename;
      const items = snapshot.val().items;

      let storeItems = [];
      if (items) {
        Object.keys(items).map(itemKey => {
          const productName = items[itemKey].productName;
          const productPrice = items[itemKey].productPrice;
          const description = items[itemKey].description;
          const productImage = items[itemKey].productImage;

          storeItems.push({ productName, productPrice, description, productImage, itemKey });
        });
      }

      return { storeName, storeItems };
    })
}

function deleteStoreItem(req, res) {
  db.ref(`/stores/${req.user.store.link}/items/${req.params.itemKey}`)
    .remove()
    .then(() => {
      res.redirect('/manage');
    })
    .catch(() => {
      res.send('Could not delete store item.');
    })
}

function manageStore(req, res) {
  if (!req.user.store) {
    res.send("Please create a store first.");
    return;
  }

  getStoreInfo(req.user.store.link).then((data) => {
    res.render('manage', { currentUserName: req.user.name,
       store: req.user.store, storeItems: data.storeItems, baseUrl: req.hostname });
  })
}

function addItemToStore(req, res) {
  const storeLink = req.user.store.link;
  const productName = req.body.productname;
  const productPrice = req.body.productprice;
  const description = req.body.description;
  const productImage = req.body.image;

  const ref = db.ref('/');
  const userStoreRef = ref.child(`stores/${storeLink}/items`);

  userStoreRef.push({
    productName,
    productPrice,
    description,
    productImage
  })

  res.redirect('/manage');
}

function viewStore(req, res) {
  const storeID = req.params.storeID;
  getStoreInfo(storeID).then((data) => {
    if (!data) {
      res.render("404");
      return;
    }

    res.render('store', { title: "Store", currentStoreID: storeID,
     storeName: data.storeName, storeItems: data.storeItems })
  });
}

module.exports = {
    manageStore,
    viewStore,
    addItemToStore
}
