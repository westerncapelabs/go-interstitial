var go = {};
go;

go.app = function() {
    var vumigo = require('vumigo_v02');
    var App = vumigo.App;
    var Choice = vumigo.states.Choice;
    var ChoiceState = vumigo.states.ChoiceState;
    var EndState = vumigo.states.EndState;


    var GoInterstitial = App.extend(function(self) {
        App.call(self, 'states_start');
        var $ = self.$;
        var interrupt = true;

        function timed_out() {
            return self.im.msg.session_event === 'new'
                && self.im.user.state.name
                && self.im.user.state.name !== 'states_start';
        }

        function add(name, creator) {
            self.states.add(name, function(name, opts) {
                if (!interrupt || !timed_out())
                    return creator(name, opts);

                interrupt = false;
                opts = opts || {};
                opts.name = name;
                return self.states.create('states_timed_out', opts);
            });
        }

        add('states_start', function(name) {
            return new ChoiceState(name, {
                question: $('Please choose a drink type'),

                choices: [
                    new Choice('coffee', $('Coffee')),
                    new Choice('tea', $('Tea')),
                    new Choice('soft drink', $('Soft drink'))
                ],

                next: function(choice) {
                    return {
                        name: 'states_type',
                        creator_opts: {
                            answer: choice.value
                        }
                    };
                }
            });
        });

        add('states_type', function(name, creator_opts) {
            return new ChoiceState(name, {
                question: $('When do you want your {{drink_type}}?')
                    .context({
                        drink_type: creator_opts.answer
                    }),

                choices: [
                    new Choice('now', $('Now')),
                    new Choice('later', $('Later'))
                ],

                next: "states_end_thanks"
            });
        });

        add('states_end_thanks', function(name) {
            return new EndState(name, {
                text: $('Thank you. You\'ll get your drink at the time you requested'),

                next: 'states_start'
            });
        });

        add('states_timed_out', function(name, creator_opts) {
            
            return new ChoiceState(name, {
                question: $('Do you want to go back to the start or continue?'),

                choices: [
                    new Choice('states_start', $('Start over')),
                    new Choice(creator_opts.name, $('Continue'))
                ],

                next: function(choice) {
                    return {
                        name: choice.value,
                        creator_opts: creator_opts
                    };
                }
            });
        });

    });

    return {
        GoInterstitial: GoInterstitial
    };
}();


go.init = function() {
    var vumigo = require('vumigo_v02');
    var InteractionMachine = vumigo.InteractionMachine;
    var GoInterstitial = go.app.GoInterstitial;


    return {
        im: new InteractionMachine(api, new GoInterstitial())
    };
}();
