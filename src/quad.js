function Quadtree(level, x, y, width, height) {
    this.level = level;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.objects = [];
    this.nodes = [];
}
Quadtree.prototype.max_objects = 4;
Quadtree.prototype.max_levels = 5;
Quadtree.prototype.clear = function(){
    this.objects.length = 0;
    for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].clear();
    }
    this.nodes.length = 0;
};
Quadtree.prototype.split = function(){
    var subWidth = Math.round(this.width / 2);
    var subHeight = Math.round(this.height / 2);
    var x = Math.round(this.x);
    var y = Math.round(this.y);
    this.nodes[0] = new Quadtree(this.level+1, x + subWidth, y, subWidth, subHeight);
    this.nodes[1] = new Quadtree(this.level+1, x, y, subWidth, subHeight);
    this.nodes[2] = new Quadtree(this.level+1, x, y + subHeight, subWidth, subHeight);
    this.nodes[3] = new Quadtree(this.level+1, x + subWidth, y + subHeight, subWidth, subHeight);
};
Quadtree.prototype.getIndex = function(rect){
    var index = -1;
    var verticalMidpoint = this.x + (this.width / 2);
    var horizontalMidpoint = this.y + (this.height / 2);

    var topQuadrant = (rect.y < horizontalMidpoint && rect.y + rect.height < horizontalMidpoint);
    var bottomQuadrant = (rect.y > horizontalMidpoint);

    if( rect.x < verticalMidpoint && rect.x + rect.width < verticalMidpoint ) {
        if( topQuadrant ) {
            index = 1;
        } else if( bottomQuadrant ) {
            index = 2;
        }
    } else if( rect.x > verticalMidpoint ) {
        if( topQuadrant ) {
            index = 0;
        } else if( bottomQuadrant ) {
            index = 3;
        }
    }
    return index;
};
Quadtree.prototype.retrieve = function(rect){
    var index = this.getIndex(rect);
    var returnObjects = this.objects;
    if(this.nodes.length > 0) {
        if(index !== -1){
            returnObjects = returnObjects.concat(this.nodes[index].retrieve(rect));
        } else {
            for( var i=0; i < this.nodes.length; i++ ) {
                returnObjects = returnObjects.concat(this.nodes[i].retrieve(rect));
            }
        }
    }
    return returnObjects;
};
Quadtree.prototype.insert = function(rect){
    var i = 0;
    var index;
    if(this.nodes.length > 0) {
        index = this.getIndex( rect );
        if( index !== -1 ) {
            this.nodes[index].insert( rect ); 
            return;
        }
    }
    this.objects.push( rect );
    if( this.objects.length > this.max_objects && this.level < this.max_levels ) {
        if( this.nodes.length === 0) {
            this.split();
        }
        while( i < this.objects.length ) {
            index = this.getIndex( this.objects[ i ] );
            if( index !== -1 ) {    
                this.nodes[index].insert( this.objects.splice(i, 1)[0] );
            } else {
                i = i + 1;
            }
        }
    }
};

module.exports.Quadtree = Quadtree;