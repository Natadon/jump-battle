
class GameMap {
    constructor(scene, levelID) {
        this.scene = scene;
        this.levelID = levelID;
        this.mapCount = 2;
    }

    nextMap()
    {
        if(this.levelID < this.mapCount) {
            this.levelID++;
        } else {
            this.levelID = 1;
        }

        return this.levelID;
    }

    createMap() {
        switch(this.levelID) {
            case 1:
                /*
                    Map #1
                    _____________________________________
                    |                                   |
                    |                                   |
                    |                                   |
                    |                                   |
                    |                    a______________|
                    |___________b                       |
                    |                                   |
                    |                  c________________|
                    | d                                 |
                    |___________________________________|
                */
                // create a group of static bodies, static bodies don't move and can't be moved
                //  by other objects
                this.scene.platforms = this.scene.physics.add.staticGroup();

                // this is the bottom most platform d (the ground)
                this.scene.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

                // platform c
                this.scene.platforms.create(600, 400, 'ground');
                // platform b
                this.scene.platforms.create(50, 250, 'ground');
                // platform a
                this.scene.platforms.create(750, 220, 'ground');
                break;
            case 2:
                /*
                    Map #2
                    _____________________________________
                    |                                   |
                    |                                   |
                    |                                   |
                    |                                   |
                    |                              a____|
                    |___________b                       |
                    |                                   |
                    |                  c________________|
                    | d                                 |
                    |___________________________________|
                */
                // create a group of static bodies, static bodies don't move and can't be moved
                //  by other objects
                this.scene.platforms = this.scene.physics.add.staticGroup();

                // this is the bottom most platform d (the ground)
                this.scene.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

                // platform c
                this.scene.platforms.create(600, 400, 'ground');
                // platform b
                this.scene.platforms.create(50, 250, 'ground');
                // platform a
                this.scene.platforms.create(870, 220, 'ground');
                break;
            default:
                break;
        }
    }
}