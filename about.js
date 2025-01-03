const lis=document.querySelectorAll('.container li'),
      ps=document.querySelectorAll('.container li p');

//移入、移出的方向
function direct(e,o){
    var w=o.offsetWidth,
        h=o.offsetHeight,
        top=o.offsetTop,
        left=o.offsetLeft,
        scrollTop=document.body.scrollTop||document.documentElement.scrollTop,
        scrollLeft=document.body.scrollLeft||document.documentElement.scrollLeft,
        offTop=top-scrollTop,
        offLeft=left-scrollLeft,
        ex=(e.pageX-scrollLeft)||e.clientX,
        ey=(e.pageY-scrollTop)||e.clientY,
        x=(ex-offLeft-w/2)*(w>h?(h/w):1),
        y=(ey-offTop-h/2)*(h>w?(w/h):1),
        angle=(Math.round((Math.atan2(y,x)*(180/Math.PI)+180)/90)+3)%4,
        directName=['上','右','下','左'];
    return directName[angle];
}


function mouseEvent(angle,o,d){
    var w=o.offsetWidth,
        h=o.offsetHeight;
    var p=o.querySelector('p');     
    p.style.transition='0s';      
    if(d=='in'){
            switch(angle){
            case '上':
                if(p.offsetLeft==0&&p.offsetTop==0) break;
                p.style.left=0;
                p.style.top=-h+'px';
                setTimeout(() => {
                    p.style.left=0;
                    p.style.top=0;
                    p.style.transition='0.2s';
                }, 50);
                break;
            case '右':
                if(p.offsetLeft==0&&p.offsetTop==0) break;
                p.style.left=w+'px';
                p.style.top=0;
                setTimeout(() => {
                    p.style.left=0;
                    p.style.top=0;
                    p.style.transition='0.2s';
                }, 50);
                break;
            case '下':
                if(p.offsetLeft==0&&p.offsetTop==0) break;
                p.style.left=0;
                p.style.top=h+'px';
                setTimeout(() => {
                    p.style.left=0;
                    p.style.top=0;
                    p.style.transition='0.2s';
                }, 50);
                break;
            case '左':
                if(p.offsetLeft==0&&p.offsetTop==0) break;
                p.style.left=-w+'px';
                p.style.top=0;
                setTimeout(() => {
                    p.style.left=0;
                    p.style.top=0;
                    p.style.transition='0.2s';
                }, 50);
                break;
        }
    }else if(d=='out'){ 
        switch(angle){
            case '上':
                setTimeout(() => {
                    p.style.left=0;
                    p.style.top=-h+'px';
                    p.style.transition='0.2s';
                    p.style.transitionDelay='0.1s';
                }, 50);
                break;
            case '右':
                setTimeout(() => {
                    p.style.left=w+'px';
                    p.style.top=0;
                    p.style.transition='0.2s';
                    p.style.transitionDelay='0.1s';
                }, 50);
                break;
            case '下':
                setTimeout(() => {
                    p.style.left=0;
                    p.style.top=h+'px';
                    p.style.transition='0.2s';
                    p.style.transitionDelay='0.1s';
                }, 50);
                break;
            case '左':
                setTimeout(() => {
                    p.style.left=-w+'px';
                    p.style.top=0;
                    p.style.transition='0.2s';
                    p.style.transitionDelay='0.1s';
                }, 50);
                break;
        }
    }
}

lis.forEach(li=>{
    li.addEventListener('mouseenter',function(e){
        var e=e||window.event;
        var angle=direct(e,this);
        mouseEvent(angle,this,'in');
    })
    li.addEventListener('mouseleave',function(e){
        var e=e||window.event;
        var angle=direct(e,this);
        mouseEvent(angle,this,'out');
    })
})