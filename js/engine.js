let Engine = (function(global) {
    let doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        animationID,
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    //victory modal
    const victoryModal = document.getElementById('victory-modal');

    //play again button
    const playAgainButton = document.getElementById('play-again');

    //play again button listening for clicks, reseting victory to false, reseting the player position, hiding the modal and starting the animation over again
    playAgainButton.addEventListener('click', function() {
        player.victory = false;
        player.resetPosition("false");
        victoryModal.classList.add('hide');
        win.requestAnimationFrame(main);
    })

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {

        //Checking for victory
        if (player.victory == true) {
            //if there's a victory, we stop calling the animation frame method
            win.cancelAnimationFrame(animationID);
            //removing the hide class from the victory modal
            victoryModal.classList.toggle('hide');
        }
        else {
            //if there's no victory, we keep calling animation frame method
            animationID = win.requestAnimationFrame(main);
        }

        //time delta
        let now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);
        render();
        lastTime = now;
    }

    /* Initial setup */
    function init() {
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data.*/
    function update(dt) {
        updateEntities(dt);
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height);

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick.
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function.*/
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* Loading the images.*/
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-cat-girl.png'
    ]);
    Resources.onReady(init);

    /* Assigning the canvas' context object to the global variable (the window object) */
    global.ctx = ctx;
})(this);
