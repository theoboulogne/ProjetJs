//Chronometre repris sur internet : 
//https://codes-sources.commentcamarche.net/source/45122-chronometre-en-javascript
//***********************************************************************************************************
var One=true;
var Int;
function Chrono(){
    //var MSec=parseInt(Ext(GetEle(document.forms[0].Text_1.value,3)));
    var Sec=parseInt(Ext(GetEle(document.forms[0].Text_1.value,1)));
    var Min=parseInt(Ext(GetEle(document.forms[0].Text_1.value,0)));
    //if(MSec<100){
    //    MSec++;
    //}
    //else{
    Sec++;//MSec=0;
    if(Sec>60){
        Min++;Sec=0;
    }
        
    document.forms[0].Text_1.value=Trans(Min)+":"+Trans(Sec);
    
}

    function GetEle(s,i){
    var Ele=new Array();
    var s_=s+":";
    var j;
    var m=0;
    var s__="";
    for (j=0;j<s_.length;j++){
    if(s_.charAt(j)!=":"){
        s__=s__+s_.charAt(j);
        }else{
            Ele[m]=s__;
            s__="";m++;
            }
        }
            return Ele[i];
    }
    function Trans(i){
        if(i<10){
        return "0"+i;
        }else{
            return i;
            }
    }
    function Ext(s){
    var s_=parseInt(s.substring(1,s.length));
    if(parseInt(s)<10){
        return parseInt(s_);
        }else{
            return s;
            }
    }
    function SetInt(){
        if(One){
            Int=setInterval("Chrono()",1000);
        One=false;
        }else{
            clearInterval(Int);
            One=true;
        }
    }