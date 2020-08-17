

let spriteImg="../assets/images/pokemon.png";
let pokeBallImg="../assets/images/pokeball.png";
let grassImg="../assets/images/grass_tile.png"
let canvasId="pokemon-canvas";
/**
 * check if the given co ordinate lies within the 2d space
 * @param {*} width 
 * @param {*} height 
 * @param {*} x 
 * @param {*} y 
 */
function boundaryValidation(sw,sh,width,height, x, y){
        if(x<sw||y<sh||x>=width||y>=height)
            return false;
        return true;
}
/**
 * get mid point
 */
function mid(x){
    return parseInt((x+1)/2);
}
/**
 * swap two elements
 * @param {} a 
 * @param {*} x 
 * @param {*} y 
 */
function swap(a,x,y){
    let temp=a[x];
    a[x]=a[y];
    a[y]=temp;
}
/**
 * shuffle x elements of the array
 */
function shuffle(a,x){
    let len=Math.min(a.length,x);
    for(let i=0;i<len;i++){
            let index=parseInt(Math.random()*a.length);
            swap(a,i,index);
    }
    return a.slice(0,x);
}
/**
 * object holding x,y cordinate with validation function 
 * validation function checks for space constraint b4 changin position
 */
class pos{
    constructor(x,y,validate){
        this.x=parseInt(x);
        this.y=parseInt(y);
        this.validate=validate;
    }
    changePos=(xval,yval)=>{
        xval=parseInt(xval);
        yval=parseInt(yval);
        let validate=this.validate;
        if(validate&&!validate(this.x+xval,this.y+yval))
            return false;
        this.x+=xval;
        this.y+=yval;
        return true;
    }
    setPos=(x,y)=>{
        x=parseInt(x);
        y=parseInt(y);
        let validate=this.validate;
        if(validate&&!validate(x,y))
            return false;
        this.x=x;
        this.y=y;
        return true;
    }
    compare=(pos)=>{
        return pos.x==this.x&&pos.y==this.y;
    }
}
/**
 * Cells of a grid which holds the position and if occupied by pokeball
 */
class cell{
    constructor(pos,isOccupied=false){
            this.pos=pos;
            this.isOccupied=isOccupied;
    }
}
/**
 * view board contains the playarea handles the movement of sprite and 
 * 
 */
class ViewBoard{
    static width=600;
    static height=600;
    static cellLength=30;
    constructor(pos,tileImg){
        this.pos=pos;
        this.tileImg=tileImg;
        this.cellsArray=[];
        this.makeGrid();
        
    }
    makeGrid=()=>{
        this.rows=ViewBoard.height/ViewBoard.cellLength;
        this.cols=ViewBoard.width/ViewBoard.cellLength;
        this.Grid=new Array(this.rows);
        let cellSize=ViewBoard.cellLength;
        for(let i=0;i<this.rows;i++){
            this.Grid[i]=new Array(this.cols);
            for(let j=0;j<this.cols;j++){
                this.Grid[i][j]=new cell(new pos(j*cellSize+this.pos.x,i*cellSize+this.pos.y));
                this.cellsArray.push(this.Grid[i][j]);
            }
        }
    }
    drawGrid=(ctx)=>{
        let cellSize=ViewBoard.cellLength;
        for(let i=0;i<this.rows;i++){
            for(let j=0;j<this.cols;j++){
                let pos=this.Grid[i][j].pos;
                ctx.drawImage(this.tileImg,pos.x,pos.y,cellSize,cellSize);
            }
        }
       
    }
    getCellPos=(x,y)=>{
        let position=this.Grid[x][y].pos
        return new pos(position.x,position.y);
    }
    randomCells=(units)=>{
        return shuffle(this.cellsArray.slice(),units);
    }
}
/**
 * sprite class handles the pokemon view ,movement 
 */
class Sprite{
    constructor(pos,img,width,height){
        this.pos=pos;
        this.img=img;
        this.width=width;
        this.height=height;
    }
    move=(x,y)=>{
        this.pos.changePos(x,y);
    }
    draw=(ctx)=>{
          
            ctx.drawImage(this.img,this.pos.x,this.pos.y,this.width,this.height);
    }
}
/**
 * handles the pokeball view 
 */
class Pokeball{
    constructor(pos,img,w,h){
            this.pos=pos;
            this.img=img;
            this.width=w;
            this.height=h;
    }
    draw=(ctx)=>{
        ctx.drawImage(this.img,this.pos.x,this.pos.y,this.width,this.height);
    }
}
/**
 * handles text box view and updates
 */
class TextNode{
    constructor(pos,text,font="15px serif",color="white"){
        this.pos=pos;
        this.font=font;
        this.color=color;
        this.text=text;
    }
    setText=(text)=>{
        this.text=text;
    }
    getText=()=>{
        return this.text;
    }
    draw=(ctx)=>{
        ctx.font=this.font;
        ctx.fillStyle=this.color;
        ctx.fillText(this.text,this.pos.x,this.pos.y);
    }
}
/**
 * handles all the scoreboard related updates and logic
 */
class ScoreBoard{
    static width=600;
    static height=50;
    static scorePos=new pos(this.width-100,25);
    static highScorePos=new pos(10,25);
    static totalTimePos=new pos(mid(this.width)-100,25);
    static nextBallTimePos=new pos(mid(this.width),25);
    
    constructor(pos,nextBallTime=10,initScore=0,initHighScore="0"){
        this.pos=pos;
        
        this.totalTime=0;
        this.nextBallTime=40;
        this.score=0;
        this.highScore=0;
        this. initScore=initScore;
        this. initHighScore=initHighScore;
        this. initTotalTime="00:00";
        this. initNextBallTime=nextBallTime+"s";
        this. ballTime=nextBallTime;
        this.init();
    }
    init=()=>{
        this.scoreView=new TextNode(ScoreBoard.scorePos,this.initScore);
        this.highscoreView=new TextNode(ScoreBoard.highScorePos,this.initHighScore);
        this.totalTimeView=new TextNode(ScoreBoard.totalTimePos,this.initTotalTime);
        this.nextBallTimeView=new TextNode(ScoreBoard.nextBallTimePos,this.initNextBallTime);
    }
    drawbackground=(ctx)=>{
        ctx.fillStyle="red";    
        ctx.fillRect(this.pos.x,this.pos.y,ScoreBoard.width,ScoreBoard.height);
            
    }
    draw=(ctx)=>{
            this.drawbackground(ctx);
            this.scoreView.draw(ctx);
            this.highscoreView.draw(ctx);
            this.totalTimeView.draw(ctx);
            this.nextBallTimeView.draw(ctx);
    }
    convertSecToMins=(time)=>{
        let mins=parseInt(time/60);
        let sec=time%60;
        sec=sec>9?sec:`0${sec}`;
        mins=mins>9?mins:`0${mins}`;
        return `${mins}:${sec}`
    }
    updateScore=(val)=>{
        let score=this.score+val;
        if(score<0)
            return ;
        if(score>this.highScore)
            this.updateHighScore(score);
        this.score=score;
        this.scoreView.setText(this.score);
    }
    updateHighScore=(val)=>{
        if(val>=0&&val>=this.highScore)
            this.highScore=val;
        this.highscoreView.setText(this.highScore);
    }
    updateTime=()=>{
        this.totalTime+=1;
        this.nextBallTime-=1;
        this.nextBallTime=(this.nextBallTime+this.ballTime)%this.ballTime;
        this.totalTimeView.setText(this.convertSecToMins(this.totalTime));
        this.nextBallTimeView.setText(this.nextBallTime+"s");
    }
    resetBallTime =()=>{
        this.nextBallTime=1;
    }
}
/**
 * handle game over view
 */
class GameOver{
    constructor(pos,score){
        this.text="GameOver";
        this.score=score;
        this.pos=pos;
    }
    draw=(ctx)=>{
        ctx.font="30px serif";
        ctx.fillStyle="white";
        ctx.fillText(this.text,this.pos.x,this.pos.y);
        ctx.font="15px serif";
        ctx.fillText(this.score,this.pos.x,this.pos.y+30);
        
    }

}
/**
 * handles view of entire game ,fps,game logic and scoring 
 */
class Game{
    static viewpos=new pos(0,50);
    static scoreboardpos=new pos(0,0);
    static width=600;
    static height=650;
    static movementSpeed=10;
    static fps=1000/Game.movementSpeed
    constructor(canvasId,images,pokeBallsUnits=15){
        if(!canvasId)
            throw new Error('Argument missing')
        this.sprite=null;
        this.canvas=document.getElementById(canvasId);
        if(!this.canvas.getContext)
            throw new Error('Browser doesn\'t support');
        this.ctx=this.canvas.getContext('2d');
        this.canvas.width=Game.width;
        this.canvas.height=Game.height;
        this.scoreboard=null;
        this.images=images;
        this.pokeBallsUnits=pokeBallsUnits;
        this.init();
    }
    init=()=>{
        this.gameover=null;
        this.view=new ViewBoard(Game.viewpos,this.images[2]);
        this.scoreBoard=new ScoreBoard(Game.scoreboardpos);
        let position=this.view.getCellPos(mid(this.view.cols),mid(this.view.rows));
        let newPos=new pos(position.x,position.y,boundaryValidation.bind(null,this.view.pos.x,this.view.pos.y,this.view.pos.x+ViewBoard.width,this.view.pos.y+ViewBoard.height))
        this.sprite=new Sprite(newPos,images[1],ViewBoard.cellLength,ViewBoard.cellLength);
        this.pokeBalls=this.randomizePos();
        this.setKeyEvents();
        this.logic();
        
        this.draw();
    }
    playAgain=()=>{
        init();
    }
    retreiveData=()=>{
        data={
            highScore:0,
        };
        if(localStorage)
            data.highScore=localStorage.getItem("highScore");
    }
    gameOver=()=>{
        clearTimeout(this.timeInterval);
        clearTimeout(this.updateTime);
        let position=this.view.getCellPos(mid(this.view.cols),mid(this.view.rows));
        
       this.gameover= new GameOver(position,"Score : "+this.scoreBoard.score);
       this.gameover.draw(this.ctx)
    }
    randomizePos=()=>{
        let randomCells=this.view.randomCells(this.pokeBallsUnits);
        let pokeBalls=new Array(this.pokeBallsUnits);
        let width=ViewBoard.cellLength,height=ViewBoard.cellLength;
        for(let i in randomCells){
            randomCells[i].isOccupied=true;
            pokeBalls[i]=new Pokeball(randomCells[i].pos,images[0],width,height);
        }
       
        return pokeBalls;
    }
    setKeyEvents=()=>{
        this.movement=new pos(0,0);
        let moveY=ViewBoard.cellLength,moveX=ViewBoard.cellLength;
        document.addEventListener('keydown',(e)=>{
                e.preventDefault();
                switch(e.which){
                    case 37:
                        this.movement=new pos(-moveX,0);
                        break;
                    case 38:
                        this.movement=new pos(0,-moveY);
                        break;
                    case 39:
                        this.movement=new pos(moveX,0);
                        break;
                    case 40:
                        this.movement=new pos(0,moveY);
                        break;
                    default:
                        this.movement=new pos(0,0);

                }        
                
        });

    }

    incScore=()=>{
            this.scoreBoard.updateScore(1);
            this.scoreBoard.resetBallTime();
    }
    decScore=()=>{
            this.scoreBoard.updateScore(-1);
    }
    moveSprite=()=>{
            if(this.gameover)
               {
                   return this.gameover.draw(this.ctx);
               }
            this.spriteInterval= setTimeout(()=>{
                let position=this.movement;
                this.movement=new pos(0,0);
                this.sprite.move(position.x,position.y);
                position=this.sprite.pos;
                if(this.popPokeBall&&position.compare(this.popPokeBall.pos))
                    {   this.popPokeBall=null;
                        this.incScore();
                        if(this.pokeBalls.length==0)
                            return this.gameOver();
                    }
                this.draw();
               
                    return this.moveSprite();
            },Game.fps);
        return this.spriteInterval;
    }
    pickRandomPokeBall =()=>{
        let index=parseInt(Math.random()*this.pokeBalls.length);
        return this.pokeBalls.splice(index,1)[0];
    }
    updateTime=()=>{
        if(this.gameover)
               {
                   return this.gameover.draw(this.ctx);
               }
         this.timeInterval= setTimeout(()=>{
            this.scoreBoard.updateTime();
            
            if(this.scoreBoard.nextBallTime==0){
                if(this.pokeBalls.length==0)
                    return this.gameOver();
                this.popPokeBall=this.pickRandomPokeBall();
                if(this.popPokeBall.pos.compare(this.sprite.pos))
                    this.incScore();
            }
            this.draw();
            
            
               return this.updateTime();
        },1000);

        return this.timeInterval;
    }
    logic=()=>{
        if(this.timeInterval)
            clearTimeout(this.timeInterval);
        if(this.updateTime)
            clearTimeout(this.updateTime);
        this.moveSprite();
        this.updateTime();
        this.popPokeBall=this.pickRandomPokeBall();
    }
    drawPokeBalls=()=>{
        for(let i in this.pokeBalls)
            this.pokeBalls[i].draw(this.ctx)
    }
    draw=()=>{
        let ctx=this.ctx;
        
       this.view.drawGrid(ctx);
       if(this.popPokeBall)
        this.popPokeBall.draw(ctx);
       this.sprite.draw(ctx);
      
       this.scoreBoard.draw(ctx);
       
    }
}

/**
 * promisify image load to retreive image from urls
 * @param {*} url 
 */
function promisifyImageLoad(url){
    return new Promise((resolve,reject)=>{
        let image=new Image();
        image.addEventListener('load',()=>resolve(image));
        image.addEventListener('error',(e)=>reject(e));
        image.src=url;
    });
}
let images=null;
let game=null;
async function init(){
     images=await Promise.all([promisifyImageLoad(pokeBallImg),promisifyImageLoad(spriteImg),promisifyImageLoad(grassImg)]);
     game=new Game(canvasId,images);
    
}
init();
    
    