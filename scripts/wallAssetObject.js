class WallAssetObject extends AssetObject{
    constructor(position = [0, 0, 0], scale = [1, 1, 1], rotate = [0, 0, 0]) {
        super(modelList["box"], textureList["concrete"], position, scale, rotate, new AlignedBoxCollision(scale[0], scale[1], scale[2]));
    }

}