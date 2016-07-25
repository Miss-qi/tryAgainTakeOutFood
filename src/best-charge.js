function amountId(selectedItems) {
  return selectedItems.map(function (item) {
    let itemBarcodes = item.split(' x ');
    return {
      id: itemBarcodes[0],
      amount: parseInt(itemBarcodes[1])
    };
  });
}

function matchPromotions(itemsIdCount, allPromoteItems) {
  let itemsPromotionList = [];
  let type;
  itemsIdCount.map(function (itemsPromotion) {
    allPromoteItems.find(function (item) {
      if (item.items) {
        let existItems = item.items.find(function (id) {
          return id === itemsPromotion.id;
        });
        if (existItems) {
          type = item.type;
        }
      }
      else {
        type = '满30减6元';
      }
    });
    itemsPromotionList.push(Object.assign({}, itemsPromotion, {type: type}));
  });
  return itemsPromotionList;
}

function matchItems(itemsPromotionList, allItems) {
  let itemsList = [];
  itemsPromotionList.map(function (items) {
    let existItems = allItems.find(function (item) {
      return item.id === items.id;
    });
    if (existItems){
      itemsList.push(Object.assign({},existItems,{amount:items.amount},{type:items.type}));
    }
  });
  return itemsList;
}

function calculateSubtotal(itemsList) {
  let itemSubtotal = [];
  let subtotal = 0;
  itemsList.map(function (item) {
    subtotal = item.price * item.amount;
    itemSubtotal.push(Object.assign({}, item, {subtotal: subtotal}));
  });
  return itemSubtotal;
}

function calculateTotal(itemSubtotal) {
  let total = 0;
  itemSubtotal.map(function (item) {
    total += item.subtotal;
  });
  return total;
}

function calculateSavedSubtotal(itemsList) {
  let itemDiscountSubtotal = [];
  let discountSubtotal = 0;
  itemsList.map(function (item) {
    if (item.type === '指定菜品半价'){
      discountSubtotal = item.price * (item.amount/2);
    }
    else {
      discountSubtotal = item.price * item.amount;
    }
    itemDiscountSubtotal.push(Object.assign({},item,{discountSubtotal:discountSubtotal}));
  });
  return itemDiscountSubtotal;
}

function calculateSavedTotal(itemDiscountSubtotal, total) {
  let discountTotal = 0;
  let minTotal = total;
  itemDiscountSubtotal.map(function (item) {
    discountTotal += item.discountSubtotal;
  })
  if (total > 30) {
    if ((total - 6) > discountTotal) {
      minTotal = discountTotal;
    }
    else {
      minTotal = total - 6;
    }
  }
  return minTotal;
}

function print(itemSubtotal, discountTotal, total) {
  let receipt = "============= 订餐明细 =============\n";
  itemSubtotal.map(function (item) {
    receipt += item.name + " x " + item.amount + " = " + item.subtotal
      + "元\n";
  });
  receipt += '-----------------------------------';
  if (total > 30) {
    receipt += '\n';
  }
  if (total > 30) {
    receipt += '使用优惠:\n';
    if (discountTotal < (total - 6)) {
      receipt += '指定菜品半价(';
      for (let i = 0; i < itemSubtotal.length; i++) {
        if (itemSubtotal[i].type === '指定菜品半价') {
          receipt += itemSubtotal[i].name;
          for (let j = i + 1; j < itemSubtotal.length; j++) {
            if (itemSubtotal[j].type === '指定菜品半价') {
              receipt += '，';
            }
          }
        }
      }
      receipt += ')，省' + (total - discountTotal) + '元\n' +
        '-----------------------------------\n'
    }
    else {
      receipt += '满30减6元';
      receipt += '，省' + (total - discountTotal) + '元\n' +
        '-----------------------------------\n'
    }
  }
  if (total < 30) {
    receipt += '\n';
  }
  receipt += '总计：' + discountTotal + '元\n' +
    '===================================';
  return receipt;
}

function bestCharge(selectedItems) {
  let allItems = loadAllItems();
  let allPromoteItems = loadPromotions();
  let itemsIdCount = amountId(selectedItems);
  let itemsPromotionList = matchPromotions(itemsIdCount, allPromoteItems);
  let itemsList = matchItems(itemsPromotionList, allItems);
  let itemSubtotal = calculateSubtotal(itemsList);
  let total = calculateTotal(itemSubtotal);
  let itemDiscountSubtotal = calculateSavedSubtotal(itemsList);
  let discountTotal = calculateSavedTotal(itemDiscountSubtotal, total);
  let receipt = print(itemSubtotal, discountTotal, total);
  return receipt;
}
