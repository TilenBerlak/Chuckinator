class gunAssetObject extends assetObject{
    constructor(position = [0, 0, 0], scale = [1, 1, 1], rotate = [0, 0, 0]) {
        super(modelList["gun"], gunTexture, position, scale, rotate);
    }

}