import './index.scss'

// am-fade-leave am-fade-lave-active
// am-zoom-leave am-zoom-leave-active


// am-fade-enter am-fade-enter-active
// am-zoom-enter am-zoom-enter-active

import { Toast } from 'antd-mobile'
import {getYzm,getImg} from '../../fetch/home'


const msgLogo = [require('./img/1.png'), require('./img/2.png'), require('./img/3.png')]
var baseDom = (logo, msg, btn, callBack, callBack2  )=>{

        let content = '', footer = '';
        content = msg.split('|_|').map((item)=>{
            return `<div>${item}</div>`
        }).join('')
        footer = btn.split('|_|').map((item, index, b)=>{
            return `<div class="${(b.length == 2 && index == 0 ?'cancel':'ok')}">${item}</div>`
        })

        let L = `<div class="layer">
                <div class="mask am-fade-enter am-fade-enter-active"></div>
                <div class="warp">
                    <div class="warp-content am-zoom-enter am-zoom-enter-active">
                        <div class="layer-header"><img src="${msgLogo[logo]}"></div>
                        <div class="layer-body">${content}</div>
                        <div class="layer-footer ${(footer.length==2?'two':'')}">${footer.join('')}</div>
                    </div>
                </div>
            </div>`
        document.body.insertAdjacentHTML('beforeend', L);



        document.querySelector('.layer .ok').addEventListener("click", ()=>{
                document.querySelector('.layer .warp-content').setAttribute('class', 'warp-content am-zoom-leave am-zoom-leave-active');
                // document.querySelector('.layer .mask').setAttribute('class', 'mask am-fade-enter am-fade-enter-active');
                setTimeout(()=>{
                    document.body.removeChild(document.querySelector('.layer'));
                    typeof callBack == 'function' && callBack();
                }, 150)
        }, false);
        document.querySelectorAll('.cancel').length && document.querySelector('.layer .cancel').addEventListener("click", ()=>{
                document.querySelector('.layer .warp-content').setAttribute('class', 'warp-content am-zoom-leave am-zoom-leave-active');
                setTimeout(()=>{
                    document.body.removeChild(document.querySelector('.layer'));
                    typeof callBack2 == 'function' && callBack2();
                }, 150)
        }, false);

        // document.removeEventListener("click", resolve, false);

        setTimeout(()=>{
            document.querySelector('.layer .warp-content').setAttribute('class', 'warp-content')
            document.querySelector('.layer .mask').setAttribute('class', 'mask')
        }, 300)
   

}
// Layer.warning('今天|_|天气真好', '取消|_|确定', ()=>{})

export let Layer = {
        warning: (msg, btn, callBack, callBack2)=>{
            baseDom('2', msg, btn, callBack, callBack2);
        },
        error: (msg, btn, callBack, callBack2)=>{
            baseDom('1', msg, btn, callBack, callBack2)
        },
        success: (msg, btn, callBack, callBack2)=>{
            baseDom('0', msg, btn, callBack, callBack2)
        }
}


var getImgYzm=()=>{
    var resImg= getImg(document.querySelector('.tel input').value)
    resImg.then(data=>{
        if(data.code!=1) return Toast.info(data.desc, 1.5, null, false);
        document.querySelector('.layer .around img').src="data:image/jpg;base64,"+data.data.image
    },(ex)=>{
        Toast.info('服务器异常,请稍后再试', 1.5, null, false);
        if (__DEV__) {
            console.error('获取验证码报错, ', ex.message)
        }
    })
}
let count=60
var  changeYzmTxt= ()=>{
    count = 60;
    let yzmInterval = setInterval(()=>{
        if(count-=1, count < 0){
            clearInterval(yzmInterval)
            document.querySelector('.inputs .yzm').innerText="重新发送"
            return ;
        }
        document.querySelector('.inputs .yzm').innerText=count +"s"
    }, 1e3)
    }
var baseDom1 = (callBack)=>{

        getImgYzm()
        let L = `<div class="layer">
                <div class="mask am-fade-enter am-fade-enter-active"></div>
                <div class="warp">
                    <div class="warp-content am-zoom-enter am-zoom-enter-active">
                        <div class="layer-header"><img src="${msgLogo[2]}"></div>
                        <div class="layer-body">
                        <div>登录异常</div>
                        <div><input type="text" pattern="[0-9]*" placeholder="请输入以下验证码" /></div>
                        <div class="around"><img src="${require('./img/yzm.png')}" alt=""/><em>看不清?点我更换</em></div>
                        </div>
                        <div class="layer-footer no"><div class="ok">确定</div></div>
                    </div>
                </div>
            </div>`
        document.body.insertAdjacentHTML('beforeend', L);
        
        document.querySelector('.layer input').addEventListener("input", (e)=>{
                let footer = document.querySelector('.layer .layer-footer');
                if(e.target.value.length == 0){//确定按钮 灰->亮
                    !/no/.test(footer.getAttribute('class')) && footer.setAttribute('class', 'layer-footer no')
                }else{
                    /no/.test(footer.getAttribute('class')) && footer.setAttribute('class', 'layer-footer')
                }
        }, false);
        document.querySelector('.layer .ok').addEventListener("click", ()=>{//点击确定
                let val = document.querySelector('.layer input').value;
                if(val.length==0){
                    return false;
                }
                var result = getYzm(document.querySelector('.tel input').value,val);
                result.then(data=>{
                    if(data.code==="2"){
                        Toast.info("图片验证码错误", 1.5, null, false)
                        return;
                    }
                    if(data.code!=1){
                        Toast.info(data.desc, 1.5, null, false)
                        return;
                    }
                    changeYzmTxt()
                    setTimeout(()=>{
                        document.querySelector('.layer .warp-content').setAttribute('class', 'warp-content am-zoom-leave am-zoom-leave-active');
                        document.body.removeChild(document.querySelector('.layer'));
                    }, 150)
                },(ex)=>{
                Toast.info('服务器异常,请稍后再试', 1.5, null, false);
                if (__DEV__) {
                    console.error('获取验证码报错, ', ex.message)
                }
            })
               /* typeof callBack == 'function' && callBack();*/
        }, false);
        document.querySelector('.layer .around').addEventListener("click",()=>{//点击切换验证码
            getImgYzm()
        },false)

        setTimeout(()=>{
            document.querySelector('.layer .warp-content').setAttribute('class', 'warp-content')
            document.querySelector('.layer .mask').setAttribute('class', 'mask')
        }, 300)
   

}


/*
Prompt.warning()
*/
export let Prompt = {
        warning: (callBack)=>{
            baseDom1(callBack);
        }
        
}