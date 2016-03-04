var Scale = function (scaleFactor) {
    this.scaleFactor = scaleFactor;
};

Scale.prototype = {
    scale:function(size) {
        return Math.round(size* this.scaleFactor);
    }
}