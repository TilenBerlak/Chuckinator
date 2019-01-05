class WarpgateAssetObject extends AssetObject{
    constructor(position = [0, 0, 0], scale = [1, 1, 1], rotate = [0, 0, 0]) {
        super(modelList["warpgate"], textureList["warpgate"], position, scale, rotate, new AlignedBoxCollision(10, 10,10));
    }

}