class AlienAssetObject extends AssetObject{
    constructor(position = [0, 0, 0], scale = [1, 1, 1], rotate = [0, 0, 0]) {
        super(modelList["alien"], textureList["alien"], position, scale, rotate);
    }

}