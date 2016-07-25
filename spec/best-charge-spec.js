describe("amountId",function () {
  it("amountId test",function () {
    let selectedItems = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let result = amountId(selectedItems);
    let itemsTag = [
      {
        id:'ITEM0001',
        amount:1
      },
      {
        id:'ITEM0013',
        amount:2
      },
      {
        id:'ITEM0022',
        amount:1
      }
    ];
    expect(result).toEqual(itemsTag);
  })
});

describe("matchPromotions",function () {
  it("matchPromotions test",function () {
    let itemsIdCount = [
      {
        id:'ITEM0001',
        amount:1
      },
      {
        id:'ITEM0013',
        amount:2
      },
      {
        id:'ITEM0022',
        amount:1
      }
    ];
    let promotionsList = [{
      type: '满30减6元'
      },
      {
      type: '指定菜品半价',
      items: ['ITEM0001', 'ITEM0022']
      }];
    let result = matchPromotions(itemsIdCount,promotionsList);
    let expected = [
      {
        id:'ITEM0001',
        amount:1,
        type: '指定菜品半价'
      },
      {
        id:'ITEM0013',
        amount:2,
        type: '满30减6元'
      },
      {
        id:'ITEM0022',
        amount:1,
        type: '指定菜品半价'
      }
    ];
    expect(result).toEqual(expected);
  })
});

describe("matchItems",function () {
  it("matchItems test",function () {
    let itemsPromotionList = [
      {
        id:'ITEM0001',
        amount:1,
        type: '指定菜品半价'
      },
      {
        id:'ITEM0013',
        amount:2,
        type: '满30减6元'
      },
      {
        id:'ITEM0022',
        amount:1,
        type: '指定菜品半价'
      }
    ];
    let allItems = [
      {
        id: 'ITEM0001',
        name: '黄焖鸡',
        price: 18.00
      },
      {
        id: 'ITEM0013',
        name: '肉夹馍',
        price: 6.00
      },
      {
        id: 'ITEM0022',
        name: '凉皮',
        price: 8.00
      },
      {
        id: 'ITEM0030',
        name: '冰锋',
        price: 2.00
      }];
    let result = matchItems(itemsPromotionList, allItems);
    let expected = [
      {
        id:'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        amount:1,
        type: '指定菜品半价'
      },
      {
        id:'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        amount:2,
        type: '满30减6元'
      },
      {
        id:'ITEM0022',
        name: '凉皮',
        price: 8.00,
        amount:1,
        type: '指定菜品半价'
      }
    ];
    expect(result).toEqual(expected);
  })
});

describe("calculateSubtotal",function () {
  it("calculateSubtotal test",function () {
    let itemsList = [
      {
        id:'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        amount:1,
        type: '指定菜品半价'
      },
      {
        id:'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        amount:2,
        type: '满30减6元'
      },
      {
        id:'ITEM0022',
        name: '凉皮',
        price: 8.00,
        amount:1,
        type: '指定菜品半价'
      }
    ];
    let result = calculateSubtotal(itemsList);
    let expected = [
      {
        id:'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        amount:1,
        type: '指定菜品半价',
        subtotal:18.00
      },
      {
        id:'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        amount:2,
        type: '满30减6元',
        subtotal:12.00
      },
      {
        id:'ITEM0022',
        name: '凉皮',
        price: 8.00,
        amount:1,
        type: '指定菜品半价',
        subtotal:8.00
      }
    ];
    expect(result).toEqual(expected);
  })
});

describe("calculateTotal",function () {
  it("calculateTotal test",function () {
    let itemSubtotal = [
      {
        id:'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        amount:1,
        type: '指定菜品半价',
        subtotal:18.00
      },
      {
        id:'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        amount:2,
        type: '满30减6元',
        subtotal:12.00
      },
      {
        id:'ITEM0022',
        name: '凉皮',
        price: 8.00,
        amount:1,
        type: '指定菜品半价',
        subtotal:8.00
      }
    ];
    let result = calculateTotal(itemSubtotal);
    let expected = 38.00;
    expect(result).toEqual(expected);
  })
});

describe("calculateSavedSubtotal",function () {
  it("calculateSavedSubtotal test",function () {
    let itemsList = [
      {
        id:'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        amount:1,
        type: '指定菜品半价'
      },
      {
        id:'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        amount:2,
        type: '满30减6元'
      },
      {
        id:'ITEM0022',
        name: '凉皮',
        price: 8.00,
        amount:1,
        type: '指定菜品半价'
      }
    ];
    let result = calculateSavedSubtotal(itemsList);
    let expected = [
      {
        id:'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        amount:1,
        type: '指定菜品半价',
        discountSubtotal:9.00

      },
      {
        id:'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        amount:2,
        type: '满30减6元',
        discountSubtotal:12.00
      },
      {
        id:'ITEM0022',
        name: '凉皮',
        price: 8.00,
        amount:1,
        type: '指定菜品半价',
        discountSubtotal:4.00
      }
    ];
    expect(result).toEqual(expected);
  })
});

describe("calculateSavedTotal",function () {
  it("calculateSavedTotal test",function () {
    let itemDiscountSubtotal = [
      {
        id:'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        amount:1,
        type: '指定菜品半价',
        discountSubtotal:9.00

      },
      {
        id:'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        amount:2,
        type: '满30减6元',
        discountSubtotal:12.00
      },
      {
        id:'ITEM0022',
        name: '凉皮',
        price: 8.00,
        amount:1,
        type: '指定菜品半价',
        discountSubtotal:4.00
      }
    ];
    let total = 38.00;
    let result = calculateSavedTotal(itemDiscountSubtotal,total);
    let expected = 25.00;
    expect(result).toEqual(expected);
  })
});

describe('Take out food', function () {

  it('should generate best charge when best is 指定菜品半价', function() {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when best is 满30减6元', function() {
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when no promotion can be used', function() {
    let inputs = ["ITEM0013 x 4"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

});
