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
  for (let i = 0; i < itemsIdCount.length; i++) {
    allPromoteItems.find(function (item) {
      if (item.items) {
        let existItems = item.items.find(function (id) {
          return id === itemsIdCount[i].id;
        });
        if (existItems) {
          type = item.type;
        }
      }
      else {
        type = "满30减6元";
      }

    });
    itemsPromotionList.push(Object.assign({}, itemsIdCount[i], {type: type}));
  }
  return itemsPromotionList;
}

function matchItems(itemsPromotionList, allItems) {
  let itemsList = [];
  for (let i = 0; i < itemsPromotionList.length; i++) {
    let existItems = allItems.find(function (item) {
      if (item.id === itemsPromotionList[i].id) {
        return item;
      }
    });
    if (existItems) {
      itemsList.push(Object.assign({}, existItems, {amount: itemsPromotionList[i].amount}, {type: itemsPromotionList[i].type}));
    }
  }
  return itemsList;
}

function calculateSubtotal(itemsList) {
  let itemSubtotal = [];
  let subtotal = 0;
  for (let i = 0; i < itemsList.length; i++) {
    subtotal = itemsList[i].price * itemsList[i].amount;
    itemSubtotal.push(Object.assign({}, itemsList[i], {subtotal: subtotal}));
  }
  return itemSubtotal;
}

function calculateTotal(itemSubtotal) {
  let total = 0;
  for (let i = 0; i < itemSubtotal.length; i++) {
    total += itemSubtotal[i].subtotal;
  }
  return total;
}

function calculateSavedSubtotal(itemsList) {
  let itemDiscountSubtotal = [];
  let discountSubtotal = 0;
  for (let i = 0; i < itemsList.length; i++) {
    if (itemsList[i].type === '指定菜品半价') {
      discountSubtotal = itemsList[i].amount * parseFloat(itemsList[i].price / 2);
    }
    else {
      discountSubtotal = itemsList[i].amount * itemsList[i].price;
    }
    itemDiscountSubtotal.push(Object.assign({}, itemsList[i], {discountSubtotal: discountSubtotal}));
  }
  return itemDiscountSubtotal;
}

function calculateSavedTotal(itemDiscountSubtotal, total) {
  let discountTotal = 0;
  let minTotal = total;
  for (let i = 0; i < itemDiscountSubtotal.length; i++) {
    discountTotal += itemDiscountSubtotal[i].discountSubtotal;
  }
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
  for (let i = 0; i < itemSubtotal.length; i++) {
    receipt += itemSubtotal[i].name + " x " + itemSubtotal[i].amount + " = " + itemSubtotal[i].subtotal
      + "元\n";
  }
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
