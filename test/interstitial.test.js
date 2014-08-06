var vumigo = require('vumigo_v02');
var AppTester = vumigo.AppTester;



describe("app", function() {
    describe("for reconnecting via an interstitial screen", function() {
        var app;
        var tester;

        beforeEach(function() {
            app = new go.app.GoInterstitial();
            tester = new AppTester(app);

            tester
                .setup.config.app({
                    name: 'interstitial',
                    metric_store: 'test_metric_store',
                    endpoints: {
                        "sms": {"delivery_class": "sms"}
                    },
                })
                .setup.char_limit(160);
        });

        describe("when the user starts a session", function() {
            it("should ask what they want to drink", function() {
                return tester
                    .setup.user.addr('+27001')
                    .start()
                    .check.interaction({
                        state: 'states_start',
                        reply: [
                            'Please choose a drink type',
                            '1. Coffee',
                            '2. Tea',
                            '3. Soft drink'
                        ].join('\n')
                    })
                    .run();
            });
        });

        describe("when the user selects a drink type", function() {
            it("should ask when they want it", function() {
                return tester
                    .setup.user.addr('+27001')
                    .setup.user.state('states_start')
                    .input('1')
                    .check.interaction({
                        state: 'states_type',
                        reply: [
                            'When do you want your coffee?',
                            '1. Now',
                            '2. Later'
                        ].join('\n')
                    })
                    .run();
            });
        });

        describe("when the user answers their timing", function() {
            it("should thank them and end", function() {
                return tester
                    .setup.user.addr('+27001')
                    .setup.user.state('states_type')
                    .input('1')
                    .check.interaction({
                        state: 'states_end_thanks',
                        reply: 'Thank you. You\'ll get your drink at the time you requested'
                    })
                    .check.reply.ends_session()
                    .run();
            });
        });

        describe("when the user selected a drink type but is restarting session", function() {
            it.skip("should ask if continue or restart", function() {
                return tester
                    .setup.user.addr('+27001')
                    .input.session_event('new')
                    .input('1')
                    .check.interaction({
                        state: 'states_timed_out',
                        reply: [
                            'Do you want to go back to the start or continue?',
                            '1. Start over',
                            '2. Continue'
                        ].join('\n')
                    })
                    .run();
            });
        });

    });
});
