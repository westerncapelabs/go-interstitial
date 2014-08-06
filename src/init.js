go.init = function() {
    var vumigo = require('vumigo_v02');
    var InteractionMachine = vumigo.InteractionMachine;
    var GoInterstitial = go.app.GoInterstitial;


    return {
        im: new InteractionMachine(api, new GoInterstitial())
    };
}();
