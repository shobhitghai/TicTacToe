$(function () {
    var playViewModel = function () {
        var self = this;

        //local Variables
        var counter = 0;
        var validWinCriteria = [];
        var arrX = [];
        var arr0 = [];

        self.cellSetup = ko.observableArray();
        self.gameType = [
            { id: 1, type: '3x3 (Level Medium)' },
            { id: 2, type: '4x4 (Level Genius)' }
        ];

        var game3x3 = [
            { id: 0, weight: 1 }, { id: 1, weight: 2 },
            { id: 2, weight: 4 }, { id: 3, weight: 8 },
            { id: 4, weight: 16 }, { id: 5, weight: 32 },
            { id: 6, weight: 64 }, { id: 7, weight: 128 },
            { id: 8, weight: 256 }
        ];

        var game4x4 = [{ id: 0, weight: 1 }, { id: 1, weight: 2 },
            { id: 2, weight: 4 }, { id: 3, weight: 8 },
            { id: 4, weight: 16 }, { id: 5, weight: 32 },
            { id: 6, weight: 64 }, { id: 7, weight: 128 },
            { id: 8, weight: 256 }, { id: 9, weight: 512 },
            { id: 10, weight: 1024 }, { id: 11, weight: 2048 },
            { id: 12, weight: 4096 }, { id: 13, weight: 8192 },
            { id: 14, weight: 16384 }, { id: 15, weight: 32768 }
        ];

        self.cellSetup = ko.observableArray();
        
        self.setup3x3 = function () {
            self.cellSetup(game3x3);
            self.containerClass('small');
        };

        self.setup4x4 = function () {
            self.cellSetup(game4x4);
            self.containerClass('big');
        };

        self.resetGame = function(value) {
            self.cellSetup([]);
            counter = value;
            arrX = [];
            arr0 = [];
        };


        //Observables
        self.containerClass = ko.observable('small');
        self.selectedType = ko.observable('1');
        self.boxText = ko.observable();

        self.gameWrapper = ko.computed(function () {
            if (self.selectedType() == '1') {
                self.setup3x3();
                validWinCriteria = [7, 56, 73, 84, 146, 273, 292, 448];
                counter = 0;
            } else {
                self.setup4x4();
                validWinCriteria = [15, 240, 3840, 61440, 33825, 4680, 4369, 8738, 17476, 34592];
                counter = 0;
            }
        });


        //Click and Win logic
        self.boxClick = function (id, weight) {
            var el = $($('.box > .box-text')[id]);
            if (!el.text().length) {
                if (counter == 0) {
                    self.checkWinForX(el, weight);
                } else {
                    counter % 2 ? self.checkWinFor0(el, weight) : self.checkWinForX(el, weight);
                }
                counter++;
                self.checkForDraw(counter);
            }
        };

        self.checkWinForX = function (el, wt) {
            el.text('X');
            arrX.push(wt);
            $.each(validWinCriteria, function (index, item) {
                if (self.computeWinCombination(arrX, item)) {
                    alert('Player X wins');
                    self.resetGame(-1);
                    self.selectedType() == '1' ? self.setup3x3() : self.setup4x4();
                }
            });
        };

        self.checkWinFor0 = function (el, wt) {
            el.text('0');
            arr0.push(wt);
            $.each(validWinCriteria, function (index, item) {
                if (self.computeWinCombination(arr0, item)) {
                    alert('Player 0 wins');
                    self.resetGame(-1);
                    self.selectedType() == '1' ? self.setup3x3() : self.setup4x4();
                }
            });
        };

        self.checkForDraw = function(ctr) {
            if (self.selectedType() == '1') {
               if (ctr == 9) {
                   alert('Game Draws');
                   self.resetGame(0);
                   self.setup3x3();   
               }
            } else {
                if (ctr == 16) {
                    alert('Game Draws');
                    self.resetGame(0);
                    self.setup4x4();   
                }
            }
        };

        self.computeWinCombination = function (selectedObj, winItem) {
            var n = selectedObj.slice(1);
            return !winItem || (!selectedObj.length ? false : self.computeWinCombination(n, winItem) || self.computeWinCombination(n, winItem - selectedObj[0]));
        };
    };

    ko.applyBindings(new playViewModel());

});