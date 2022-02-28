const mergeExisting = (obj1, obj2) => {
    const mutableObject1 = Object.assign({}, obj1);
    const mutableObject2 = Object.assign({}, obj2);
  
    mergeFunction(mutableObject1, mutableObject2);
  
    return mutableObject1;
  };
  
  const mergeFunction = (obj1, obj2) => {
    Object.keys(obj2).forEach(function (key) {
      if (key in obj1) {
        if (typeof obj1[key] === 'object') {
          mergeFunction(obj1[key], obj2[key]);
        } else {
          obj1[key] = obj2[key];
        }
      }
    });
  };

export { mergeExisting }