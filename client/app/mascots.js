const MascotList = (props) => {
    $("#domoMessage").animate({width:'hide'}, 350);

    const mascotNodes = (Object.keys(props.mascots)).map(function(mascot){
        console.log(mascot)
        return(
            <div id={mascot}  className="domo" onClick={ (e) => handleMascotClick(e, mascot)}>
                <img src={`/assets/img/mascots/${props.mascots[mascot]}`} alt="mascot" className="domoFace"/>
                <div className="domoContent">
                <h3 >Name: {mascot}</h3> 
                </div>
            </div>
        );
    });

    return (
        <div className="domoList">
            {mascotNodes}
        </div>
    );
}

const handleMascotClick = (e, mascot) => {
    sendAjax('POST', '/mascots', `mascot=${mascot}&_csrf=${csrf}`, function() {
        location.reload();
    });
};