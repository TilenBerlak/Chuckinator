class WatertankAssetObject extends AssetObject{
    constructor(position = [0, 0, 0], scale = [1, 1, 1], rotate = [0, 0, 0]) {
        super(modelList["watertank"], textureList["gun"], position, scale, rotate);
    }

}