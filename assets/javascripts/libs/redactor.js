_0x8057 = require("./redactor.strings");

// for(var i=0; i<_0x8057.length; i++) {
// 	var s = _0x8057[i].toString();
// 	// if(s.indexOf("css") > -1) {
// 		console.log(s);
// 	// }
// }

(function($) {
    _0x8057[0];
    if (!Function[_0x8057[2]][_0x8057[1]]) {
        Function[_0x8057[2]][_0x8057[1]] = function(scope) {
            var fn = this;
            return function() {
                return fn[_0x8057[3]](scope);
            };
        };
    };
    var uuid = 0;
    var reUrlYoutube = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w.\-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
    var reUrlVimeo = /https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
    $[_0x8057[5]][_0x8057[4]] = function(options) {
        var val = [];
        var args = Array[_0x8057[2]][_0x8057[7]][_0x8057[6]](arguments, 1);
        if (typeof options === _0x8057[8]) {
            this[_0x8057[20]](function() {
                var instance = $[_0x8057[9]](this, _0x8057[4]);
                var func;
                if (options[_0x8057[10]](/\./) != _0x8057[11]) {
                    func = options[_0x8057[13]](_0x8057[12]);
                    if (typeof instance[func[0]] != _0x8057[14]) {
                        func = instance[func[0]][func[1]];
                    };
                } else {
                    func = instance[options];
                };
                if (typeof instance !== _0x8057[14] && $[_0x8057[15]](func)) {
                    var methodVal = func[_0x8057[3]](instance, args);
                    if (methodVal !== undefined && methodVal !== instance) {
                        val[_0x8057[16]](methodVal);
                    };
                } else {
                    $[_0x8057[19]](_0x8057[17] + options + _0x8057[18]);
                };
            });
        } else {
            this[_0x8057[20]](function() {
                $[_0x8057[9]](this, _0x8057[4], {});
                $[_0x8057[9]](this, _0x8057[4], Redactor(this, options));
            });
        };
        if (val[_0x8057[21]] === 0) {
            return this;
        } else {
            if (val[_0x8057[21]] === 1) {
                return val[0];
            } else {
                return val;
            };
        };
    };

    function Redactor(el, options) {
        return new Redactor[_0x8057[2]][_0x8057[22]](el, options);
    };
    $[_0x8057[23]] = Redactor;
    $[_0x8057[23]][_0x8057[24]] = _0x8057[25];
    $[_0x8057[23]][_0x8057[26]] = [_0x8057[27], _0x8057[28], _0x8057[29], _0x8057[30], _0x8057[31], _0x8057[32], _0x8057[33], _0x8057[34], _0x8057[35], _0x8057[36], _0x8057[37], _0x8057[38], _0x8057[39], _0x8057[40], _0x8057[41], _0x8057[42], _0x8057[43], _0x8057[44], _0x8057[45], _0x8057[46], _0x8057[47], _0x8057[48], _0x8057[49], _0x8057[50], _0x8057[51], _0x8057[52], _0x8057[53], _0x8057[54], _0x8057[55], _0x8057[56], _0x8057[57], _0x8057[58], _0x8057[59], _0x8057[60], _0x8057[61], _0x8057[62]];
    $[_0x8057[23]][_0x8057[63]] = {
        lang: _0x8057[64],
        direction: _0x8057[65],
        plugins: false,
        focus: false,
        focusEnd: false,
        placeholder: false,
        visual: true,
        tabindex: false,
        minHeight: false,
        maxHeight: false,
        linebreaks: false,
        replaceDivs: true,
        paragraphize: true,
        cleanStyleOnEnter: false,
        enterKey: true,
        cleanOnPaste: true,
        cleanSpaces: true,
        pastePlainText: false,
        autosave: false,
        autosaveName: false,
        autosaveInterval: 60,
        autosaveOnChange: false,
        linkTooltip: true,
        linkProtocol: _0x8057[66],
        linkNofollow: false,
        linkSize: 50,
        imageEditable: true,
        imageLink: true,
        imagePosition: true,
        imageFloatMargin: _0x8057[67],
        imageResizable: true,
        imageUpload: null,
        imageUploadParam: _0x8057[38],
        uploadImageField: false,
        dragImageUpload: true,
        fileUpload: null,
        fileUploadParam: _0x8057[38],
        dragFileUpload: true,
        s3: false,
        convertLinks: true,
        convertUrlLinks: true,
        convertImageLinks: true,
        convertVideoLinks: true,
        preSpaces: 4,
        tabAsSpaces: false,
        tabKey: true,
        scrollTarget: false,
        toolbar: true,
        toolbarFixed: true,
        toolbarFixedTarget: document,
        toolbarFixedTopOffset: 0,
        toolbarExternal: false,
        toolbarOverflow: false,
        source: true,
        buttons: [_0x8057[68], _0x8057[69], _0x8057[70], _0x8057[71], _0x8057[72], _0x8057[73], _0x8057[74], _0x8057[75], _0x8057[41], _0x8057[40], _0x8057[38], _0x8057[48], _0x8057[27], _0x8057[76]],
        buttonsHide: [],
        buttonsHideOnMobile: [],
        formatting: [_0x8057[77], _0x8057[78], _0x8057[79], _0x8057[80], _0x8057[81], _0x8057[82], _0x8057[83], _0x8057[84], _0x8057[85]],
        formattingAdd: false,
        tabifier: true,
        deniedTags: [_0x8057[68], _0x8057[86], _0x8057[48], _0x8057[87], _0x8057[88], _0x8057[89], _0x8057[90], _0x8057[91]],
        allowedTags: false,
        removeComments: false,
        replaceTags: [
            [_0x8057[92], _0x8057[93]]
        ],
        replaceStyles: [
            [_0x8057[94], _0x8057[95]],
            [_0x8057[96], _0x8057[97]],
            [_0x8057[98], _0x8057[99]],
            [_0x8057[100], _0x8057[93]]
        ],
        removeDataAttr: false,
        removeAttr: false,
        allowedAttr: false,
        removeWithoutAttr: [_0x8057[101]],
        removeEmpty: [_0x8057[77]],
        activeButtons: [_0x8057[72], _0x8057[71], _0x8057[70], _0x8057[102], _0x8057[73], _0x8057[74], _0x8057[103], _0x8057[104], _0x8057[105], _0x8057[106]],
        activeButtonsStates: {
            b: _0x8057[70],
            strong: _0x8057[70],
            i: _0x8057[71],
            em: _0x8057[71],
            del: _0x8057[72],
            strike: _0x8057[72],
            ul: _0x8057[73],
            ol: _0x8057[74],
            u: _0x8057[102]
        },
        shortcuts: {
            "\x63\x74\x72\x6C\x2B\x73\x68\x69\x66\x74\x2B\x6D\x2C\x20\x6D\x65\x74\x61\x2B\x73\x68\x69\x66\x74\x2B\x6D": {
                func: _0x8057[107]
            },
            "\x63\x74\x72\x6C\x2B\x62\x2C\x20\x6D\x65\x74\x61\x2B\x62": {
                func: _0x8057[108],
                params: [_0x8057[70]]
            },
            "\x63\x74\x72\x6C\x2B\x69\x2C\x20\x6D\x65\x74\x61\x2B\x69": {
                func: _0x8057[108],
                params: [_0x8057[71]]
            },
            "\x63\x74\x72\x6C\x2B\x68\x2C\x20\x6D\x65\x74\x61\x2B\x68": {
                func: _0x8057[108],
                params: [_0x8057[109]]
            },
            "\x63\x74\x72\x6C\x2B\x6C\x2C\x20\x6D\x65\x74\x61\x2B\x6C": {
                func: _0x8057[108],
                params: [_0x8057[110]]
            },
            "\x63\x74\x72\x6C\x2B\x6B\x2C\x20\x6D\x65\x74\x61\x2B\x6B": {
                func: _0x8057[111]
            },
            "\x63\x74\x72\x6C\x2B\x73\x68\x69\x66\x74\x2B\x37": {
                func: _0x8057[112],
                params: [_0x8057[74]]
            },
            "\x63\x74\x72\x6C\x2B\x73\x68\x69\x66\x74\x2B\x38": {
                func: _0x8057[112],
                params: [_0x8057[73]]
            }
        },
        shortcutsAdd: false,
        buffer: [],
        rebuffer: [],
        emptyHtml: _0x8057[113],
        invisibleSpace: _0x8057[114],
        imageTypes: [_0x8057[115], _0x8057[116], _0x8057[117]],
        indentValue: 20,
        verifiedTags: [_0x8057[118], _0x8057[119], _0x8057[120], _0x8057[95], _0x8057[121], _0x8057[122], _0x8057[123], _0x8057[97], _0x8057[99], _0x8057[124], _0x8057[92], _0x8057[93], _0x8057[125], _0x8057[126], _0x8057[127], _0x8057[128]],
        inlineTags: [_0x8057[95], _0x8057[120], _0x8057[99], _0x8057[97], _0x8057[123], _0x8057[35], _0x8057[93], _0x8057[129], _0x8057[130], _0x8057[131], _0x8057[122], _0x8057[121], _0x8057[132], _0x8057[133], _0x8057[125], _0x8057[124]],
        alignmentTags: [_0x8057[134], _0x8057[135], _0x8057[136], _0x8057[137], _0x8057[138], _0x8057[139], _0x8057[140], _0x8057[141], _0x8057[142], _0x8057[143], _0x8057[144], _0x8057[145], _0x8057[146], _0x8057[147], _0x8057[148], _0x8057[149], _0x8057[150], _0x8057[151], _0x8057[152], _0x8057[153], _0x8057[154]],
        blockLevelElements: [_0x8057[155], _0x8057[156], _0x8057[157], _0x8057[158]],
        langs: {
            en: {
                html: _0x8057[159],
                video: _0x8057[160],
                image: _0x8057[161],
                table: _0x8057[162],
                link: _0x8057[163],
                link_insert: _0x8057[164],
                link_edit: _0x8057[165],
                unlink: _0x8057[166],
                formatting: _0x8057[167],
                paragraph: _0x8057[168],
                quote: _0x8057[169],
                code: _0x8057[170],
                header1: _0x8057[171],
                header2: _0x8057[172],
                header3: _0x8057[173],
                header4: _0x8057[174],
                header5: _0x8057[175],
                bold: _0x8057[176],
                italic: _0x8057[177],
                fontcolor: _0x8057[178],
                backcolor: _0x8057[179],
                unorderedlist: _0x8057[180],
                orderedlist: _0x8057[181],
                outdent: _0x8057[182],
                indent: _0x8057[183],
                cancel: _0x8057[184],
                insert: _0x8057[185],
                save: _0x8057[186],
                _delete: _0x8057[187],
                insert_table: _0x8057[188],
                insert_row_above: _0x8057[189],
                insert_row_below: _0x8057[190],
                insert_column_left: _0x8057[191],
                insert_column_right: _0x8057[192],
                delete_column: _0x8057[193],
                delete_row: _0x8057[194],
                delete_table: _0x8057[195],
                rows: _0x8057[196],
                columns: _0x8057[197],
                add_head: _0x8057[198],
                delete_head: _0x8057[199],
                title: _0x8057[200],
                image_position: _0x8057[201],
                none: _0x8057[202],
                left: _0x8057[203],
                right: _0x8057[204],
                center: _0x8057[205],
                image_web_link: _0x8057[206],
                text: _0x8057[207],
                mailto: _0x8057[208],
                web: _0x8057[209],
                video_html_code: _0x8057[210],
                file: _0x8057[211],
                upload: _0x8057[212],
                download: _0x8057[213],
                choose: _0x8057[214],
                or_choose: _0x8057[215],
                drop_file_here: _0x8057[216],
                align_left: _0x8057[217],
                align_center: _0x8057[218],
                align_right: _0x8057[219],
                align_justify: _0x8057[220],
                horizontalrule: _0x8057[221],
                deleted: _0x8057[222],
                anchor: _0x8057[223],
                link_new_tab: _0x8057[224],
                underline: _0x8057[225],
                alignment: _0x8057[226],
                filename: _0x8057[227],
                edit: _0x8057[228]
            }
        }
    };
    Redactor[_0x8057[5]] = $[_0x8057[23]][_0x8057[2]] = {
        keyCode: {
            BACKSPACE: 8,
            DELETE: 46,
            DOWN: 40,
            ENTER: 13,
            SPACE: 32,
            ESC: 27,
            TAB: 9,
            CTRL: 17,
            META: 91,
            SHIFT: 16,
            ALT: 18,
            RIGHT: 39,
            LEFT: 37,
            LEFT_WIN: 91
        },
        init: function(el, options) {
            this[_0x8057[229]] = $(el);
            this[_0x8057[230]] = uuid++;
            this[_0x8057[231]] = false;
            this[_0x8057[232]] = false;
            this[_0x8057[233]](options);
            this[_0x8057[234]]();
            this[_0x8057[69]] = {};
            $[_0x8057[237]](this[_0x8057[63]][_0x8057[235]], this[_0x8057[63]][_0x8057[236]]);
            this[_0x8057[238]] = new RegExp(_0x8057[239] + this[_0x8057[63]][_0x8057[235]][_0x8057[241]](_0x8057[240]) + _0x8057[242], _0x8057[123]);
            this[_0x8057[59]][_0x8057[243]]();
            this[_0x8057[46]][_0x8057[244]]();
            $[_0x8057[246]](this[_0x8057[63]][_0x8057[57]], this[_0x8057[63]][_0x8057[245]]);
            this[_0x8057[36]][_0x8057[248]](_0x8057[247]);
            this[_0x8057[247]] = true;
            this[_0x8057[31]][_0x8057[249]]();
        },
        loadOptions: function(options) {
            this[_0x8057[63]] = $[_0x8057[246]]({}, $[_0x8057[246]](true, {}, $[_0x8057[23]][_0x8057[63]]), this[_0x8057[229]][_0x8057[9]](), options);
        },
        getModuleMethods: function(object) {
            return Object[_0x8057[252]](object)[_0x8057[251]](function(property) {
                return typeof object[property] == _0x8057[250];
            });
        },
        loadModules: function() {
            var len = $[_0x8057[23]][_0x8057[26]][_0x8057[21]];
            for (var i = 0; i < len; i++) {
                this[_0x8057[253]]($[_0x8057[23]][_0x8057[26]][i]);
            };
        },
        bindModuleMethods: function(module) {
            if (typeof this[module] == _0x8057[14]) {
                return;
            };
            this[module] = this[module]();
            var methods = this[_0x8057[254]](this[module]);
            var len = methods[_0x8057[21]];
            for (var z = 0; z < len; z++) {
                this[module][methods[z]] = this[module][methods[z]][_0x8057[1]](this);
            };
        },
        alignment: function() {
            return {
                left: function() {
                    this[_0x8057[27]][_0x8057[256]](_0x8057[255]);
                },
                right: function() {
                    this[_0x8057[27]][_0x8057[256]](_0x8057[257]);
                },
                center: function() {
                    this[_0x8057[27]][_0x8057[256]](_0x8057[258]);
                },
                justify: function() {
                    this[_0x8057[27]][_0x8057[256]](_0x8057[106]);
                },
                set: function(type) {
                    if (!this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        this[_0x8057[261]][_0x8057[39]]();
                    };
                    this[_0x8057[30]][_0x8057[256]]();
                    this[_0x8057[56]][_0x8057[262]]();
                    this[_0x8057[27]][_0x8057[263]] = this[_0x8057[56]][_0x8057[264]]();
                    this[_0x8057[27]][_0x8057[265]] = type;
                    if (this[_0x8057[27]][_0x8057[266]]()) {
                        this[_0x8057[27]][_0x8057[267]]();
                    } else {
                        this[_0x8057[27]][_0x8057[268]]();
                    };
                    this[_0x8057[56]][_0x8057[269]]();
                    this[_0x8057[35]][_0x8057[270]]();
                },
                setText: function() {
                    var wrapper = this[_0x8057[56]][_0x8057[272]](_0x8057[271]);
                    $(wrapper)[_0x8057[276]](_0x8057[275], _0x8057[4])[_0x8057[274]](_0x8057[273], this[_0x8057[27]][_0x8057[265]]);
                },
                setBlocks: function() {
                    $[_0x8057[20]](this[_0x8057[27]][_0x8057[263]], $[_0x8057[281]](function(i, el) {
                        var $el = this[_0x8057[62]][_0x8057[277]](el);
                        if (!$el) {
                            return;
                        };
                        if (this[_0x8057[27]][_0x8057[278]]($el)) {
                            this[_0x8057[27]][_0x8057[279]]($el);
                        } else {
                            this[_0x8057[27]][_0x8057[280]]($el);
                        };
                    }, this));
                },
                isLinebreaksOrNoBlocks: function() {
                    return (this[_0x8057[63]][_0x8057[282]] && this[_0x8057[27]][_0x8057[263]][0] === false);
                },
                isNeedReplaceElement: function($el) {
                    return (this[_0x8057[27]][_0x8057[265]] === _0x8057[255] && typeof($el[_0x8057[9]](_0x8057[283])) !== _0x8057[14]);
                },
                replaceElement: function($el) {
                    $el[_0x8057[284]]($el[_0x8057[68]]());
                },
                alignElement: function($el) {
                    $el[_0x8057[274]](_0x8057[273], this[_0x8057[27]][_0x8057[265]]);
                    this[_0x8057[62]][_0x8057[285]]($el, _0x8057[90]);
                }
            };
        },
        autosave: function() {
            return {
                enable: function() {
                    if (!this[_0x8057[63]][_0x8057[28]]) {
                        return;
                    };
                    this[_0x8057[28]][_0x8057[68]] = false;
                    this[_0x8057[28]][_0x8057[286]] = (this[_0x8057[63]][_0x8057[287]]) ? this[_0x8057[63]][_0x8057[287]] : this[_0x8057[288]][_0x8057[276]](_0x8057[286]);
                    if (this[_0x8057[63]][_0x8057[289]]) {
                        return;
                    };
                    this[_0x8057[290]] = setInterval(this[_0x8057[28]][_0x8057[244]], this[_0x8057[63]][_0x8057[290]] * 1000);
                },
                onChange: function() {
                    if (!this[_0x8057[63]][_0x8057[289]]) {
                        return;
                    };
                    this[_0x8057[28]][_0x8057[244]]();
                },
                load: function() {
                    this[_0x8057[28]][_0x8057[291]] = this[_0x8057[35]][_0x8057[292]]();
                    if (this[_0x8057[28]][_0x8057[68]] === this[_0x8057[28]][_0x8057[291]]) {
                        return;
                    };
                    if (this[_0x8057[62]][_0x8057[293]](this[_0x8057[28]][_0x8057[291]])) {
                        return;
                    };
                    var data = {};
                    data[_0x8057[286]] = this[_0x8057[28]][_0x8057[286]];
                    data[this[_0x8057[28]][_0x8057[286]]] = escape(encodeURIComponent(this[_0x8057[28]][_0x8057[291]]));
                    var jsxhr = $[_0x8057[295]]({
                        url: this[_0x8057[63]][_0x8057[28]],
                        type: _0x8057[294],
                        data: data
                    });
                    jsxhr[_0x8057[297]](this[_0x8057[28]][_0x8057[296]]);
                },
                success: function(data) {
                    var json;
                    try {
                        json = $[_0x8057[298]](data);
                    } catch (e) {
                        json = data;
                    };
                    var callbackName = (typeof json[_0x8057[19]] == _0x8057[14]) ? _0x8057[28] : _0x8057[299];
                    this[_0x8057[36]][_0x8057[248]](callbackName, this[_0x8057[28]][_0x8057[286]], json);
                    this[_0x8057[28]][_0x8057[68]] = this[_0x8057[28]][_0x8057[291]];
                },
                disable: function() {
                    clearInterval(this[_0x8057[290]]);
                }
            };
        },
        block: function() {
            return {
                formatting: function(name) {
                    this[_0x8057[29]][_0x8057[300]] = false;
                    var type, value;
                    if (typeof this[_0x8057[69]][name][_0x8057[9]] != _0x8057[14]) {
                        type = _0x8057[9];
                    } else {
                        if (typeof this[_0x8057[69]][name][_0x8057[276]] != _0x8057[14]) {
                            type = _0x8057[276];
                        } else {
                            if (typeof this[_0x8057[69]][name][_0x8057[301]] != _0x8057[14]) {
                                type = _0x8057[301];
                            };
                        };
                    };
                    if (typeof this[_0x8057[69]][name][_0x8057[302]] != _0x8057[14]) {
                        this[_0x8057[29]][_0x8057[300]] = true;
                    };
                    if (type) {
                        value = this[_0x8057[69]][name][type];
                    };
                    this[_0x8057[29]][_0x8057[304]](this[_0x8057[69]][name][_0x8057[303]], type, value);
                },
                format: function(tag, type, value) {
                    if (tag == _0x8057[305]) {
                        tag = _0x8057[78];
                    };
                    var formatTags = [_0x8057[77], _0x8057[79], _0x8057[78], _0x8057[80], _0x8057[81], _0x8057[82], _0x8057[83], _0x8057[84], _0x8057[85]];
                    if ($[_0x8057[306]](tag, formatTags) == -1) {
                        return;
                    };
                    this[_0x8057[29]][_0x8057[307]] = (tag == _0x8057[79] || tag[_0x8057[10]](/h[1-6]/i) != -1);
                    if (!this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        this[_0x8057[261]][_0x8057[39]]();
                    };
                    this[_0x8057[29]][_0x8057[263]] = this[_0x8057[56]][_0x8057[264]]();
                    this[_0x8057[29]][_0x8057[308]] = this[_0x8057[29]][_0x8057[263]][_0x8057[21]];
                    this[_0x8057[29]][_0x8057[265]] = type;
                    this[_0x8057[29]][_0x8057[309]] = value;
                    this[_0x8057[30]][_0x8057[256]]();
                    this[_0x8057[56]][_0x8057[262]]();
                    this[_0x8057[29]][_0x8057[256]](tag);
                    this[_0x8057[56]][_0x8057[269]]();
                    this[_0x8057[35]][_0x8057[270]]();
                },
                set: function(tag) {
                    this[_0x8057[56]][_0x8057[292]]();
                    this[_0x8057[29]][_0x8057[310]] = this[_0x8057[313]][_0x8057[312]][_0x8057[311]];
                    if (this[_0x8057[313]][_0x8057[314]]) {
                        this[_0x8057[29]][_0x8057[315]](tag);
                    } else {
                        this[_0x8057[29]][_0x8057[316]](tag);
                    };
                },
                setCollapsed: function(tag) {
                    var block = this[_0x8057[29]][_0x8057[263]][0];
                    if (block === false) {
                        return;
                    };
                    if (block[_0x8057[311]] == _0x8057[158]) {
                        if (tag != _0x8057[78]) {
                            return;
                        };
                        this[_0x8057[29]][_0x8057[317]]();
                        return;
                    };
                    var isContainerTable = (this[_0x8057[29]][_0x8057[310]] == _0x8057[145] || this[_0x8057[29]][_0x8057[310]] == _0x8057[318]);
                    if (isContainerTable && !this[_0x8057[63]][_0x8057[282]]) {
                        document[_0x8057[322]](_0x8057[319], false, _0x8057[320] + tag + _0x8057[321]);
                        block = this[_0x8057[56]][_0x8057[323]]();
                        this[_0x8057[29]][_0x8057[324]]($(block));
                    } else {
                        if (block[_0x8057[311]][_0x8057[325]]() != tag) {
                            if (this[_0x8057[63]][_0x8057[282]] && tag == _0x8057[77]) {
                                $(block)[_0x8057[328]](_0x8057[326])[_0x8057[327]](_0x8057[326]);
                                this[_0x8057[62]][_0x8057[329]](block);
                            } else {
                                var $formatted = this[_0x8057[62]][_0x8057[330]](block, tag);
                                this[_0x8057[29]][_0x8057[324]]($formatted);
                                if (tag != _0x8057[77] && tag != _0x8057[78]) {
                                    $formatted[_0x8057[332]](_0x8057[119])[_0x8057[331]]();
                                };
                                if (this[_0x8057[29]][_0x8057[307]]) {
                                    this[_0x8057[62]][_0x8057[333]]($formatted);
                                };
                                if (tag == _0x8057[77] || this[_0x8057[29]][_0x8057[334]]) {
                                    $formatted[_0x8057[332]](_0x8057[77])[_0x8057[336]]()[_0x8057[335]]();
                                };
                                this[_0x8057[29]][_0x8057[337]]($formatted);
                            };
                        } else {
                            if (tag == _0x8057[78] && block[_0x8057[311]][_0x8057[325]]() == tag) {
                                if (this[_0x8057[63]][_0x8057[282]]) {
                                    $(block)[_0x8057[328]](_0x8057[326])[_0x8057[327]](_0x8057[326]);
                                    this[_0x8057[62]][_0x8057[329]](block);
                                } else {
                                    var $el = this[_0x8057[62]][_0x8057[330]](block, _0x8057[77]);
                                    this[_0x8057[29]][_0x8057[324]]($el);
                                };
                            } else {
                                if (block[_0x8057[311]][_0x8057[325]]() == tag) {
                                    this[_0x8057[29]][_0x8057[324]]($(block));
                                };
                            };
                        };
                    };
                },
                setMultiple: function(tag) {
                    var block = this[_0x8057[29]][_0x8057[263]][0];
                    var isContainerTable = (this[_0x8057[29]][_0x8057[310]] == _0x8057[145] || this[_0x8057[29]][_0x8057[310]] == _0x8057[318]);
                    if (block !== false && this[_0x8057[29]][_0x8057[308]] === 1) {
                        if (block[_0x8057[311]][_0x8057[325]]() == tag && tag == _0x8057[78]) {
                            if (this[_0x8057[63]][_0x8057[282]]) {
                                $(block)[_0x8057[328]](_0x8057[326])[_0x8057[327]](_0x8057[326]);
                                this[_0x8057[62]][_0x8057[329]](block);
                            } else {
                                var $el = this[_0x8057[62]][_0x8057[330]](block, _0x8057[77]);
                                this[_0x8057[29]][_0x8057[324]]($el);
                            };
                        } else {
                            if (block[_0x8057[311]] == _0x8057[158]) {
                                if (tag != _0x8057[78]) {
                                    return;
                                };
                                this[_0x8057[29]][_0x8057[317]]();
                            } else {
                                if (this[_0x8057[29]][_0x8057[310]] == _0x8057[146]) {
                                    this[_0x8057[29]][_0x8057[338]](tag);
                                } else {
                                    if (this[_0x8057[63]][_0x8057[282]] && ((isContainerTable) || (this[_0x8057[313]][_0x8057[312]] != block))) {
                                        this[_0x8057[29]][_0x8057[339]](tag);
                                    } else {
                                        if (this[_0x8057[63]][_0x8057[282]] && tag == _0x8057[77]) {
                                            $(block)[_0x8057[328]](_0x8057[326])[_0x8057[327]](_0x8057[326]);
                                            this[_0x8057[62]][_0x8057[329]](block);
                                        } else {
                                            if (block[_0x8057[311]] === _0x8057[145]) {
                                                this[_0x8057[29]][_0x8057[339]](tag);
                                            } else {
                                                var $formatted = this[_0x8057[62]][_0x8057[330]](block, tag);
                                                this[_0x8057[29]][_0x8057[324]]($formatted);
                                                if (this[_0x8057[29]][_0x8057[307]]) {
                                                    this[_0x8057[62]][_0x8057[333]]($formatted);
                                                };
                                                if (tag == _0x8057[77] || this[_0x8057[29]][_0x8057[334]]) {
                                                    $formatted[_0x8057[332]](_0x8057[77])[_0x8057[336]]()[_0x8057[335]]();
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    } else {
                        if (this[_0x8057[63]][_0x8057[282]] || tag != _0x8057[77]) {
                            if (tag == _0x8057[78]) {
                                var count = 0;
                                for (var i = 0; i < this[_0x8057[29]][_0x8057[308]]; i++) {
                                    if (this[_0x8057[29]][_0x8057[263]][i][_0x8057[311]] == _0x8057[146]) {
                                        count++;
                                    };
                                };
                                if (count == this[_0x8057[29]][_0x8057[308]]) {
                                    $[_0x8057[20]](this[_0x8057[29]][_0x8057[263]], $[_0x8057[281]](function(i, s) {
                                        if (this[_0x8057[63]][_0x8057[282]]) {
                                            $(s)[_0x8057[328]](_0x8057[326])[_0x8057[327]](_0x8057[326]);
                                            this[_0x8057[62]][_0x8057[329]](s);
                                        } else {
                                            this[_0x8057[62]][_0x8057[330]](s, _0x8057[77]);
                                        };
                                    }, this));
                                    return;
                                };
                            };
                            this[_0x8057[29]][_0x8057[339]](tag);
                        } else {
                            var classSize = 0;
                            var toggleType = false;
                            if (this[_0x8057[29]][_0x8057[265]] == _0x8057[301]) {
                                toggleType = _0x8057[324];
                                classSize = $(this[_0x8057[29]][_0x8057[263]])[_0x8057[251]](_0x8057[12] + this[_0x8057[29]][_0x8057[309]])[_0x8057[21]];
                                if (this[_0x8057[29]][_0x8057[308]] == classSize) {
                                    toggleType = _0x8057[324];
                                } else {
                                    if (this[_0x8057[29]][_0x8057[308]] > classSize) {
                                        toggleType = _0x8057[256];
                                    } else {
                                        if (classSize === 0) {
                                            toggleType = _0x8057[256];
                                        };
                                    };
                                };
                            };
                            var exceptTags = [_0x8057[126], _0x8057[127], _0x8057[128], _0x8057[340], _0x8057[341], _0x8057[342], _0x8057[343], _0x8057[344]];
                            $[_0x8057[20]](this[_0x8057[29]][_0x8057[263]], $[_0x8057[281]](function(i, s) {
                                if ($[_0x8057[306]](s[_0x8057[311]][_0x8057[325]](), exceptTags) != -1) {
                                    return;
                                };
                                var $formatted = this[_0x8057[62]][_0x8057[330]](s, tag);
                                if (toggleType) {
                                    if (toggleType == _0x8057[324]) {
                                        this[_0x8057[29]][_0x8057[324]]($formatted);
                                    } else {
                                        if (toggleType == _0x8057[331]) {
                                            this[_0x8057[29]][_0x8057[331]]($formatted);
                                        } else {
                                            if (toggleType == _0x8057[256]) {
                                                this[_0x8057[29]][_0x8057[345]]($formatted);
                                            };
                                        };
                                    };
                                } else {
                                    this[_0x8057[29]][_0x8057[324]]($formatted);
                                };
                                if (tag != _0x8057[77] && tag != _0x8057[78]) {
                                    $formatted[_0x8057[332]](_0x8057[119])[_0x8057[331]]();
                                };
                                if (this[_0x8057[29]][_0x8057[307]]) {
                                    this[_0x8057[62]][_0x8057[333]]($formatted);
                                };
                                if (tag == _0x8057[77] || this[_0x8057[29]][_0x8057[334]]) {
                                    $formatted[_0x8057[332]](_0x8057[77])[_0x8057[336]]()[_0x8057[335]]();
                                };
                            }, this));
                        };
                    };
                },
                setForce: function($el) {
                    if (this[_0x8057[29]][_0x8057[300]]) {
                        $el[_0x8057[346]](_0x8057[301])[_0x8057[346]](_0x8057[90]);
                    };
                    if (this[_0x8057[29]][_0x8057[265]] == _0x8057[301]) {
                        $el[_0x8057[347]](this[_0x8057[29]][_0x8057[309]]);
                        return;
                    } else {
                        if (this[_0x8057[29]][_0x8057[265]] == _0x8057[276] || this[_0x8057[29]][_0x8057[265]] == _0x8057[9]) {
                            $el[_0x8057[276]](this[_0x8057[29]][_0x8057[309]][_0x8057[286]], this[_0x8057[29]][_0x8057[309]][_0x8057[309]]);
                            return;
                        };
                    };
                },
                toggle: function($el) {
                    if (this[_0x8057[29]][_0x8057[300]]) {
                        $el[_0x8057[346]](_0x8057[301])[_0x8057[346]](_0x8057[90]);
                    };
                    if (this[_0x8057[29]][_0x8057[265]] == _0x8057[301]) {
                        $el[_0x8057[348]](this[_0x8057[29]][_0x8057[309]]);
                        return;
                    } else {
                        if (this[_0x8057[29]][_0x8057[265]] == _0x8057[276] || this[_0x8057[29]][_0x8057[265]] == _0x8057[9]) {
                            if ($el[_0x8057[276]](this[_0x8057[29]][_0x8057[309]][_0x8057[286]]) == this[_0x8057[29]][_0x8057[309]][_0x8057[309]]) {
                                $el[_0x8057[346]](this[_0x8057[29]][_0x8057[309]][_0x8057[286]]);
                            } else {
                                $el[_0x8057[276]](this[_0x8057[29]][_0x8057[309]][_0x8057[286]], this[_0x8057[29]][_0x8057[309]][_0x8057[309]]);
                            };
                            return;
                        } else {
                            $el[_0x8057[346]](_0x8057[349]);
                            return;
                        };
                    };
                },
                remove: function($el) {
                    $el[_0x8057[350]](this[_0x8057[29]][_0x8057[309]]);
                },
                formatListToBlockquote: function() {
                    var block = $(this[_0x8057[29]][_0x8057[263]][0])[_0x8057[352]](_0x8057[351]);
                    $(block)[_0x8057[332]](_0x8057[351])[_0x8057[336]]()[_0x8057[335]]();
                    $(block)[_0x8057[332]](_0x8057[128])[_0x8057[327]]($(_0x8057[326]))[_0x8057[336]]()[_0x8057[335]]();
                    var $el = this[_0x8057[62]][_0x8057[330]](block, _0x8057[78]);
                    this[_0x8057[29]][_0x8057[324]]($el);
                },
                formatBlockquote: function(tag) {
                    document[_0x8057[322]](_0x8057[75]);
                    document[_0x8057[322]](_0x8057[319], false, tag);
                    this[_0x8057[34]][_0x8057[353]]();
                    this[_0x8057[261]][_0x8057[332]](_0x8057[354])[_0x8057[331]]();
                    var formatted = this[_0x8057[56]][_0x8057[323]]();
                    if (tag != _0x8057[77]) {
                        $(formatted)[_0x8057[332]](_0x8057[119])[_0x8057[331]]();
                    };
                    if (!this[_0x8057[63]][_0x8057[282]]) {
                        this[_0x8057[29]][_0x8057[324]]($(formatted));
                    };
                    this[_0x8057[261]][_0x8057[332]](_0x8057[356])[_0x8057[20]]($[_0x8057[281]](this[_0x8057[62]][_0x8057[355]], this));
                    if (this[_0x8057[63]][_0x8057[282]] && tag == _0x8057[77]) {
                        this[_0x8057[62]][_0x8057[329]](formatted);
                    };
                },
                formatWrap: function(tag) {
                    if (this[_0x8057[29]][_0x8057[310]] == _0x8057[156] || this[_0x8057[29]][_0x8057[310]] == _0x8057[157]) {
                        if (tag == _0x8057[78]) {
                            this[_0x8057[29]][_0x8057[317]]();
                        } else {
                            return;
                        };
                    };
                    var formatted = this[_0x8057[56]][_0x8057[272]](tag);
                    if (formatted === false) {
                        return;
                    };
                    var $formatted = $(formatted);
                    this[_0x8057[29]][_0x8057[337]]($formatted);
                    var $elements = $formatted[_0x8057[332]](this[_0x8057[63]][_0x8057[235]][_0x8057[241]](_0x8057[357]) + _0x8057[358]);
                    if ((this[_0x8057[63]][_0x8057[282]] && tag == _0x8057[77]) || tag == _0x8057[79] || tag == _0x8057[78]) {
                        $elements[_0x8057[327]](_0x8057[359]);
                    };
                    $elements[_0x8057[336]]()[_0x8057[335]]();
                    if (tag != _0x8057[77] && tag != _0x8057[78]) {
                        $formatted[_0x8057[332]](_0x8057[119])[_0x8057[331]]();
                    };
                    $[_0x8057[20]](this[_0x8057[29]][_0x8057[263]], $[_0x8057[281]](this[_0x8057[62]][_0x8057[355]], this));
                    $formatted[_0x8057[327]](this[_0x8057[56]][_0x8057[360]](2));
                    if (!this[_0x8057[63]][_0x8057[282]]) {
                        this[_0x8057[29]][_0x8057[324]]($formatted);
                    };
                    this[_0x8057[261]][_0x8057[332]](_0x8057[356])[_0x8057[20]]($[_0x8057[281]](this[_0x8057[62]][_0x8057[355]], this));
                    $formatted[_0x8057[332]](_0x8057[361])[_0x8057[331]]();
                    if (this[_0x8057[29]][_0x8057[307]]) {
                        this[_0x8057[62]][_0x8057[333]]($formatted);
                    };
                    if (this[_0x8057[63]][_0x8057[282]] && tag == _0x8057[77]) {
                        this[_0x8057[62]][_0x8057[329]]($formatted);
                    };
                },
                formatTableWrapping: function($formatted) {
                    if ($formatted[_0x8057[352]](_0x8057[362])[_0x8057[21]] === 0) {
                        return;
                    };
                    if ($formatted[_0x8057[352]](_0x8057[363])[_0x8057[21]] === 0) {
                        $formatted[_0x8057[272]](_0x8057[364]);
                    };
                    if ($formatted[_0x8057[352]](_0x8057[340])[_0x8057[21]] === 0 && $formatted[_0x8057[352]](_0x8057[341])[_0x8057[21]] === 0) {
                        $formatted[_0x8057[272]](_0x8057[365]);
                    };
                },
                removeData: function(name, value) {
                    var blocks = this[_0x8057[56]][_0x8057[264]]();
                    $(blocks)[_0x8057[346]](_0x8057[366] + name);
                    this[_0x8057[35]][_0x8057[270]]();
                },
                setData: function(name, value) {
                    var blocks = this[_0x8057[56]][_0x8057[264]]();
                    $(blocks)[_0x8057[276]](_0x8057[366] + name, value);
                    this[_0x8057[35]][_0x8057[270]]();
                },
                toggleData: function(name, value) {
                    var blocks = this[_0x8057[56]][_0x8057[264]]();
                    $[_0x8057[20]](blocks, function() {
                        if ($(this)[_0x8057[276]](_0x8057[366] + name)) {
                            $(this)[_0x8057[346]](_0x8057[366] + name);
                        } else {
                            $(this)[_0x8057[276]](_0x8057[366] + name, value);
                        };
                    });
                },
                removeAttr: function(attr, value) {
                    var blocks = this[_0x8057[56]][_0x8057[264]]();
                    $(blocks)[_0x8057[346]](attr);
                    this[_0x8057[35]][_0x8057[270]]();
                },
                setAttr: function(attr, value) {
                    var blocks = this[_0x8057[56]][_0x8057[264]]();
                    $(blocks)[_0x8057[276]](attr, value);
                    this[_0x8057[35]][_0x8057[270]]();
                },
                toggleAttr: function(attr, value) {
                    var blocks = this[_0x8057[56]][_0x8057[264]]();
                    $[_0x8057[20]](blocks, function() {
                        if ($(this)[_0x8057[276]](name)) {
                            $(this)[_0x8057[346]](name);
                        } else {
                            $(this)[_0x8057[276]](name, value);
                        };
                    });
                },
                removeClass: function(className) {
                    var blocks = this[_0x8057[56]][_0x8057[264]]();
                    $(blocks)[_0x8057[350]](className);
                    this[_0x8057[62]][_0x8057[285]](blocks, _0x8057[301]);
                    this[_0x8057[35]][_0x8057[270]]();
                },
                setClass: function(className) {
                    var blocks = this[_0x8057[56]][_0x8057[264]]();
                    $(blocks)[_0x8057[347]](className);
                    this[_0x8057[35]][_0x8057[270]]();
                },
                toggleClass: function(className) {
                    var blocks = this[_0x8057[56]][_0x8057[264]]();
                    $(blocks)[_0x8057[348]](className);
                    this[_0x8057[35]][_0x8057[270]]();
                }
            };
        },
        buffer: function() {
            return {
                set: function(type) {
                    if (typeof type == _0x8057[14] || type == _0x8057[367]) {
                        this[_0x8057[30]][_0x8057[368]]();
                    } else {
                        this[_0x8057[30]][_0x8057[369]]();
                    };
                },
                setUndo: function() {
                    this[_0x8057[56]][_0x8057[262]]();
                    this[_0x8057[63]][_0x8057[30]][_0x8057[16]](this[_0x8057[261]][_0x8057[68]]());
                    this[_0x8057[56]][_0x8057[269]]();
                },
                setRedo: function() {
                    this[_0x8057[56]][_0x8057[262]]();
                    this[_0x8057[63]][_0x8057[370]][_0x8057[16]](this[_0x8057[261]][_0x8057[68]]());
                    this[_0x8057[56]][_0x8057[269]]();
                },
                getUndo: function() {
                    this[_0x8057[261]][_0x8057[68]](this[_0x8057[63]][_0x8057[30]][_0x8057[371]]());
                },
                getRedo: function() {
                    this[_0x8057[261]][_0x8057[68]](this[_0x8057[63]][_0x8057[370]][_0x8057[371]]());
                },
                add: function() {
                    this[_0x8057[63]][_0x8057[30]][_0x8057[16]](this[_0x8057[261]][_0x8057[68]]());
                },
                undo: function() {
                    if (this[_0x8057[63]][_0x8057[30]][_0x8057[21]] === 0) {
                        return;
                    };
                    this[_0x8057[30]][_0x8057[256]](_0x8057[372]);
                    this[_0x8057[30]][_0x8057[373]]();
                    this[_0x8057[56]][_0x8057[269]]();
                    setTimeout($[_0x8057[281]](this[_0x8057[51]][_0x8057[244]], this), 50);
                },
                redo: function() {
                    if (this[_0x8057[63]][_0x8057[370]][_0x8057[21]] === 0) {
                        return;
                    };
                    this[_0x8057[30]][_0x8057[256]](_0x8057[367]);
                    this[_0x8057[30]][_0x8057[374]]();
                    this[_0x8057[56]][_0x8057[269]]();
                    setTimeout($[_0x8057[281]](this[_0x8057[51]][_0x8057[244]], this), 50);
                }
            };
        },
        build: function() {
            return {
                run: function() {
                    this[_0x8057[31]][_0x8057[375]]();
                    this[_0x8057[31]][_0x8057[376]]();
                    this[_0x8057[31]][_0x8057[377]]();
                    this[_0x8057[31]][_0x8057[378]]();
                    this[_0x8057[31]][_0x8057[379]]();
                },
                isTextarea: function() {
                    return (this[_0x8057[229]][0][_0x8057[311]] === _0x8057[380]);
                },
                createContainerBox: function() {
                    this[_0x8057[381]] = $(_0x8057[382]);
                },
                createTextarea: function() {
                    this[_0x8057[288]] = $(_0x8057[384])[_0x8057[276]](_0x8057[286], this[_0x8057[31]][_0x8057[383]]());
                },
                getTextareaName: function() {
                    return ((typeof(name) == _0x8057[14])) ? _0x8057[385] + this[_0x8057[230]] : this[_0x8057[229]][_0x8057[276]](_0x8057[386]);
                },
                loadContent: function() {
                    var func = (this[_0x8057[31]][_0x8057[387]]()) ? _0x8057[388] : _0x8057[68];
                    this[_0x8057[389]] = $[_0x8057[390]](this[_0x8057[229]][func]());
                },
                enableEditor: function() {
                    this[_0x8057[261]][_0x8057[276]]({
                        "\x63\x6F\x6E\x74\x65\x6E\x74\x65\x64\x69\x74\x61\x62\x6C\x65": true,
                        "\x64\x69\x72": this[_0x8057[63]][_0x8057[391]]
                    });
                },
                loadEditor: function() {
                    var func = (this[_0x8057[31]][_0x8057[387]]()) ? _0x8057[392] : _0x8057[393];
                    this[_0x8057[31]][func]();
                },
                fromTextarea: function() {
                    this[_0x8057[261]] = $(_0x8057[394]);
                    this[_0x8057[288]] = this[_0x8057[229]];
                    this[_0x8057[381]][_0x8057[395]](this.$element)[_0x8057[327]](this.$editor)[_0x8057[327]](this.$element);
                    this[_0x8057[261]][_0x8057[347]](_0x8057[396]);
                    this[_0x8057[229]][_0x8057[397]]();
                },
                fromElement: function() {
                    this[_0x8057[261]] = this[_0x8057[229]];
                    this[_0x8057[31]][_0x8057[398]]();
                    this[_0x8057[381]][_0x8057[395]](this.$editor)[_0x8057[327]](this.$editor)[_0x8057[327]](this.$textarea);
                    this[_0x8057[261]][_0x8057[347]](_0x8057[396]);
                    this[_0x8057[288]][_0x8057[397]]();
                },
                setCodeAndCall: function() {
                    this[_0x8057[35]][_0x8057[256]](this[_0x8057[389]]);
                    this[_0x8057[31]][_0x8057[399]]();
                    this[_0x8057[31]][_0x8057[400]]();
                    if (this[_0x8057[63]][_0x8057[401]]) {
                        return;
                    };
                    setTimeout($[_0x8057[281]](this[_0x8057[35]][_0x8057[402]], this), 200);
                },
                callEditor: function() {
                    this[_0x8057[31]][_0x8057[403]]();
                    this[_0x8057[31]][_0x8057[404]]();
                    this[_0x8057[31]][_0x8057[405]]();
                    if (this[_0x8057[63]][_0x8057[60]]) {
                        this[_0x8057[63]][_0x8057[60]] = this[_0x8057[60]][_0x8057[22]]();
                        this[_0x8057[60]][_0x8057[31]]();
                    };
                    this[_0x8057[50]][_0x8057[406]]();
                    this[_0x8057[31]][_0x8057[407]]();
                    setTimeout($[_0x8057[281]](this[_0x8057[51]][_0x8057[244]], this), 4);
                    this[_0x8057[36]][_0x8057[248]](_0x8057[22]);
                },
                setOptions: function() {
                    $(this.$textarea)[_0x8057[276]](_0x8057[408], this[_0x8057[63]][_0x8057[391]]);
                    if (this[_0x8057[63]][_0x8057[282]]) {
                        this[_0x8057[261]][_0x8057[347]](_0x8057[409]);
                    };
                    if (this[_0x8057[63]][_0x8057[410]]) {
                        this[_0x8057[261]][_0x8057[276]](_0x8057[410], this[_0x8057[63]][_0x8057[410]]);
                    };
                    if (this[_0x8057[63]][_0x8057[411]]) {
                        this[_0x8057[261]][_0x8057[274]](_0x8057[411], this[_0x8057[63]][_0x8057[411]]);
                    };
                    if (this[_0x8057[63]][_0x8057[412]]) {
                        this[_0x8057[261]][_0x8057[274]](_0x8057[412], this[_0x8057[63]][_0x8057[412]]);
                    };
                },
                setEventDropUpload: function(e) {
                    e[_0x8057[413]]();
                    if (!this[_0x8057[63]][_0x8057[414]] || !this[_0x8057[63]][_0x8057[415]]) {
                        return;
                    };
                    var files = e[_0x8057[417]][_0x8057[416]];
                    this[_0x8057[61]][_0x8057[418]](files[0], e);
                },
                setEventDrop: function(e) {
                    this[_0x8057[35]][_0x8057[270]]();
                    setTimeout(this[_0x8057[34]][_0x8057[353]], 1);
                    this[_0x8057[36]][_0x8057[248]](_0x8057[419], e);
                },
                setEvents: function() {
                    this[_0x8057[261]][_0x8057[425]](_0x8057[420], $[_0x8057[281]](function(e) {
                        e = e[_0x8057[421]] || e;
                        if (window[_0x8057[422]] === undefined || !e[_0x8057[417]]) {
                            return true;
                        };
                        if (e[_0x8057[417]][_0x8057[416]][_0x8057[21]] === 0) {
                            return this[_0x8057[31]][_0x8057[423]](e);
                        } else {
                            this[_0x8057[31]][_0x8057[424]](e);
                        };
                        setTimeout(this[_0x8057[34]][_0x8057[353]], 1);
                        this[_0x8057[36]][_0x8057[248]](_0x8057[419], e);
                    }, this));
                    this[_0x8057[261]][_0x8057[425]](_0x8057[426], $[_0x8057[281]](function(e) {
                        var event = this[_0x8057[36]][_0x8057[427]]();
                        var type = (event == _0x8057[428] || event == _0x8057[429]) ? false : _0x8057[428];
                        this[_0x8057[36]][_0x8057[430]](type);
                        this[_0x8057[62]][_0x8057[431]]();
                        this[_0x8057[36]][_0x8057[248]](_0x8057[428], e);
                    }, this));
                    this[_0x8057[261]][_0x8057[425]](_0x8057[432], $[_0x8057[281]](this[_0x8057[53]][_0x8057[22]], this));
                    this[_0x8057[261]][_0x8057[425]](_0x8057[433], $[_0x8057[281]](this[_0x8057[44]][_0x8057[22]], this));
                    this[_0x8057[261]][_0x8057[425]](_0x8057[434], $[_0x8057[281]](this[_0x8057[45]][_0x8057[22]], this));
                    if ($[_0x8057[15]](this[_0x8057[63]][_0x8057[435]])) {
                        this[_0x8057[288]][_0x8057[425]](_0x8057[436], $[_0x8057[281]](this[_0x8057[63]][_0x8057[435]], this));
                    };
                    if ($[_0x8057[15]](this[_0x8057[63]][_0x8057[437]])) {
                        this[_0x8057[288]][_0x8057[425]](_0x8057[438], $[_0x8057[281]](this[_0x8057[63]][_0x8057[437]], this));
                    };
                    if ($[_0x8057[15]](this[_0x8057[63]][_0x8057[439]])) {
                        this[_0x8057[261]][_0x8057[425]](_0x8057[440], $[_0x8057[281]](this[_0x8057[63]][_0x8057[439]], this));
                    };
                    var clickedElement;
                    $(document)[_0x8057[425]](_0x8057[441], function(e) {
                        clickedElement = e[_0x8057[442]];
                    });
                    this[_0x8057[261]][_0x8057[425]](_0x8057[443], $[_0x8057[281]](function(e) {
                        if (this[_0x8057[231]]) {
                            return;
                        };
                        if (!this[_0x8057[31]][_0x8057[444]](clickedElement)) {
                            return;
                        };
                        this[_0x8057[62]][_0x8057[431]]();
                        if ($[_0x8057[15]](this[_0x8057[63]][_0x8057[445]])) {
                            this[_0x8057[36]][_0x8057[248]](_0x8057[446], e);
                        };
                    }, this));
                },
                isBlured: function(clickedElement) {
                    var $el = $(clickedElement);
                    return (!$el[_0x8057[448]](_0x8057[447]) && !$el[_0x8057[450]](_0x8057[449]) && $el[_0x8057[452]](_0x8057[451])[_0x8057[21]] === 0);
                },
                setHelpers: function() {
                    this[_0x8057[28]][_0x8057[453]]();
                    this[_0x8057[54]][_0x8057[453]]();
                    if (this[_0x8057[63]][_0x8057[39]]) {
                        setTimeout(this[_0x8057[39]][_0x8057[454]], 100);
                    };
                    if (this[_0x8057[63]][_0x8057[455]]) {
                        setTimeout(this[_0x8057[39]][_0x8057[456]], 100);
                    };
                },
                plugins: function() {
                    if (!this[_0x8057[63]][_0x8057[407]]) {
                        return;
                    };
                    if (!RedactorPlugins) {
                        return;
                    };
                    $[_0x8057[20]](this[_0x8057[63]][_0x8057[407]], $[_0x8057[281]](function(i, s) {
                        if (typeof RedactorPlugins[s] === _0x8057[14]) {
                            return;
                        };
                        if ($[_0x8057[306]](s, $[_0x8057[23]][_0x8057[26]]) !== -1) {
                            $[_0x8057[19]](_0x8057[457] + s + _0x8057[458]);
                            return;
                        };
                        if (!$[_0x8057[15]](RedactorPlugins[s])) {
                            return;
                        };
                        this[s] = RedactorPlugins[s]();
                        var methods = this[_0x8057[254]](this[s]);
                        var len = methods[_0x8057[21]];
                        for (var z = 0; z < len; z++) {
                            this[s][methods[z]] = this[s][methods[z]][_0x8057[1]](this);
                        };
                        if ($[_0x8057[15]](this[s][_0x8057[22]])) {
                            this[s][_0x8057[22]]();
                        };
                    }, this));
                },
                disableMozillaEditing: function() {
                    if (!this[_0x8057[62]][_0x8057[260]](_0x8057[459])) {
                        return;
                    };
                    try {
                        document[_0x8057[322]](_0x8057[460], false, false);
                        document[_0x8057[322]](_0x8057[461], false, false);
                    } catch (e) {};
                }
            };
        },
        button: function() {
            return {
                build: function(btnName, btnObject) {
                    var $button = $(_0x8057[462] + btnName + _0x8057[463] + btnName + _0x8057[464])[_0x8057[276]](_0x8057[410], _0x8057[11]);
                    if (btnObject[_0x8057[465]] || btnObject[_0x8057[466]] || btnObject[_0x8057[37]]) {
                        this[_0x8057[32]][_0x8057[467]]($button, btnName, btnObject);
                    };
                    if (btnObject[_0x8057[37]]) {
                        var $dropdown = $(_0x8057[468] + btnName + _0x8057[469]);
                        $button[_0x8057[9]](_0x8057[37], $dropdown);
                        this[_0x8057[37]][_0x8057[31]](btnName, $dropdown, btnObject[_0x8057[37]]);
                    };
                    if (this[_0x8057[62]][_0x8057[470]]()) {
                        this[_0x8057[32]][_0x8057[472]]($button, btnName, btnObject[_0x8057[471]]);
                    };
                    return $button;
                },
                setEvent: function($button, btnName, btnObject) {
                    $button[_0x8057[425]](_0x8057[473], $[_0x8057[281]](function(e) {
                        if ($button[_0x8057[448]](_0x8057[474])) {
                            return false;
                        };
                        var type = _0x8057[465];
                        var callback = btnObject[_0x8057[465]];
                        if (btnObject[_0x8057[466]]) {
                            type = _0x8057[466];
                            callback = btnObject[_0x8057[466]];
                        } else {
                            if (btnObject[_0x8057[37]]) {
                                type = _0x8057[37];
                                callback = false;
                            };
                        };
                        this[_0x8057[32]][_0x8057[475]](e, btnName, type, callback);
                    }, this));
                },
                createTooltip: function($button, name, title) {
                    var $tooltip = $(_0x8057[477])[_0x8057[347]](_0x8057[476] + name)[_0x8057[397]]()[_0x8057[68]](title);
                    $tooltip[_0x8057[478]](_0x8057[87]);
                    $button[_0x8057[425]](_0x8057[479], function() {
                        if ($(this)[_0x8057[448]](_0x8057[474])) {
                            return;
                        };
                        var pos = $button[_0x8057[480]]();
                        $tooltip[_0x8057[481]]();
                        $tooltip[_0x8057[274]]({
                            top: (pos[_0x8057[482]] + $button[_0x8057[483]]()) + _0x8057[484],
                            left: (pos[_0x8057[485]] + $button[_0x8057[486]]() / 2 - $tooltip[_0x8057[486]]() / 2) + _0x8057[484]
                        });
                    });
                    $button[_0x8057[425]](_0x8057[487], function() {
                        $tooltip[_0x8057[397]]();
                    });
                },
                onClick: function(e, btnName, type, callback) {
                    this[_0x8057[32]][_0x8057[488]] = this[_0x8057[33]][_0x8057[489]]();
                    e[_0x8057[413]]();
                    if (this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        e[_0x8057[490]] = false;
                    };
                    if (type == _0x8057[466]) {
                        this[_0x8057[42]][_0x8057[304]](callback);
                    } else {
                        if (type == _0x8057[37]) {
                            this[_0x8057[37]][_0x8057[481]](e, btnName);
                        } else {
                            this[_0x8057[32]][_0x8057[491]](e, callback, btnName);
                        };
                    };
                },
                onClickCallback: function(e, callback, btnName) {
                    var func;
                    if ($[_0x8057[15]](callback)) {
                        callback[_0x8057[6]](this, btnName);
                    } else {
                        if (callback[_0x8057[10]](/\./) != _0x8057[11]) {
                            func = callback[_0x8057[13]](_0x8057[12]);
                            if (typeof this[func[0]] == _0x8057[14]) {
                                return;
                            };
                            this[func[0]][func[1]](btnName);
                        } else {
                            this[callback](btnName);
                        };
                    };
                    this[_0x8057[51]][_0x8057[492]](e, btnName);
                },
                get: function(key) {
                    return this[_0x8057[494]][_0x8057[332]](_0x8057[493] + key);
                },
                setActive: function(key) {
                    this[_0x8057[32]][_0x8057[292]](key)[_0x8057[347]](_0x8057[495]);
                },
                setInactive: function(key) {
                    this[_0x8057[32]][_0x8057[292]](key)[_0x8057[350]](_0x8057[495]);
                },
                setInactiveAll: function(key) {
                    if (typeof key == _0x8057[14]) {
                        this[_0x8057[494]][_0x8057[332]](_0x8057[496])[_0x8057[350]](_0x8057[495]);
                    } else {
                        this[_0x8057[494]][_0x8057[332]](_0x8057[496])[_0x8057[498]](_0x8057[497] + key)[_0x8057[350]](_0x8057[495]);
                    };
                },
                setActiveInVisual: function() {
                    this[_0x8057[494]][_0x8057[332]](_0x8057[496])[_0x8057[498]](_0x8057[499])[_0x8057[350]](_0x8057[474]);
                },
                setInactiveInCode: function() {
                    this[_0x8057[494]][_0x8057[332]](_0x8057[496])[_0x8057[498]](_0x8057[499])[_0x8057[347]](_0x8057[474]);
                },
                changeIcon: function(key, classname) {
                    this[_0x8057[32]][_0x8057[292]](key)[_0x8057[347]](_0x8057[500] + classname);
                },
                removeIcon: function(key, classname) {
                    this[_0x8057[32]][_0x8057[292]](key)[_0x8057[350]](_0x8057[500] + classname);
                },
                setAwesome: function(key, name) {
                    var $button = this[_0x8057[32]][_0x8057[292]](key);
                    $button[_0x8057[350]](_0x8057[502])[_0x8057[347]](_0x8057[501]);
                    $button[_0x8057[68]](_0x8057[503] + name + _0x8057[504]);
                },
                addCallback: function($btn, callback) {
                    var type = (callback == _0x8057[37]) ? _0x8057[37] : _0x8057[465];
                    var key = $btn[_0x8057[276]](_0x8057[505]);
                    $btn[_0x8057[425]](_0x8057[473], $[_0x8057[281]](function(e) {
                        if ($btn[_0x8057[448]](_0x8057[474])) {
                            return false;
                        };
                        this[_0x8057[32]][_0x8057[475]](e, key, type, callback);
                    }, this));
                },
                addDropdown: function($btn, dropdown) {
                    var key = $btn[_0x8057[276]](_0x8057[505]);
                    this[_0x8057[32]][_0x8057[506]]($btn, _0x8057[37]);
                    var $dropdown = $(_0x8057[468] + key + _0x8057[469]);
                    $btn[_0x8057[9]](_0x8057[37], $dropdown);
                    if (dropdown) {
                        this[_0x8057[37]][_0x8057[31]](key, $dropdown, dropdown);
                    };
                    return $dropdown;
                },
                add: function(key, title) {
                    if (!this[_0x8057[63]][_0x8057[60]]) {
                        return;
                    };
                    var btn = this[_0x8057[32]][_0x8057[31]](key, {
                        title: title
                    });
                    btn[_0x8057[347]](_0x8057[502]);
                    this[_0x8057[494]][_0x8057[327]]($(_0x8057[507])[_0x8057[327]](btn));
                    return btn;
                },
                addFirst: function(key, title) {
                    if (!this[_0x8057[63]][_0x8057[60]]) {
                        return;
                    };
                    var btn = this[_0x8057[32]][_0x8057[31]](key, {
                        title: title
                    });
                    this[_0x8057[494]][_0x8057[328]]($(_0x8057[507])[_0x8057[327]](btn));
                    return btn;
                },
                addAfter: function(afterkey, key, title) {
                    if (!this[_0x8057[63]][_0x8057[60]]) {
                        return;
                    };
                    var btn = this[_0x8057[32]][_0x8057[31]](key, {
                        title: title
                    });
                    var $btn = this[_0x8057[32]][_0x8057[292]](afterkey);
                    if ($btn[_0x8057[21]] !== 0) {
                        $btn[_0x8057[509]]()[_0x8057[508]]($(_0x8057[507])[_0x8057[327]](btn));
                    } else {
                        this[_0x8057[494]][_0x8057[327]]($(_0x8057[507])[_0x8057[327]](btn));
                    };
                    return btn;
                },
                addBefore: function(beforekey, key, title) {
                    if (!this[_0x8057[63]][_0x8057[60]]) {
                        return;
                    };
                    var btn = this[_0x8057[32]][_0x8057[31]](key, {
                        title: title
                    });
                    var $btn = this[_0x8057[32]][_0x8057[292]](beforekey);
                    if ($btn[_0x8057[21]] !== 0) {
                        $btn[_0x8057[509]]()[_0x8057[510]]($(_0x8057[507])[_0x8057[327]](btn));
                    } else {
                        this[_0x8057[494]][_0x8057[327]]($(_0x8057[507])[_0x8057[327]](btn));
                    };
                    return btn;
                },
                remove: function(key) {
                    this[_0x8057[32]][_0x8057[292]](key)[_0x8057[331]]();
                }
            };
        },
        caret: function() {
            return {
                setStart: function(node) {
                    if (!this[_0x8057[62]][_0x8057[511]](node)) {
                        var space = this[_0x8057[62]][_0x8057[512]]();
                        $(node)[_0x8057[328]](space);
                        this[_0x8057[33]][_0x8057[456]](space);
                    } else {
                        this[_0x8057[33]][_0x8057[256]](node, 0, node, 0);
                    };
                },
                setEnd: function(node) {
                    this[_0x8057[33]][_0x8057[256]](node, 1, node, 1);
                },
                set: function(orgn, orgo, focn, foco) {
                    orgn = orgn[0] || orgn;
                    focn = focn[0] || focn;
                    if (this[_0x8057[62]][_0x8057[513]](orgn[_0x8057[311]]) && orgn[_0x8057[514]] === _0x8057[255]) {
                        orgn[_0x8057[514]] = this[_0x8057[63]][_0x8057[515]];
                    };
                    if (orgn[_0x8057[311]] == _0x8057[516] && this[_0x8057[63]][_0x8057[282]] === false) {
                        var parent = $(this[_0x8057[63]][_0x8057[517]])[0];
                        $(orgn)[_0x8057[284]](parent);
                        orgn = parent;
                        focn = orgn;
                    };
                    this[_0x8057[56]][_0x8057[292]]();
                    try {
                        this[_0x8057[313]][_0x8057[454]](orgn, orgo);
                        this[_0x8057[313]][_0x8057[456]](focn, foco);
                    } catch (e) {};
                    this[_0x8057[56]][_0x8057[518]]();
                },
                setAfter: function(node) {
                    try {
                        var tag = $(node)[0][_0x8057[311]];
                        if (tag != _0x8057[516] && !this[_0x8057[62]][_0x8057[511]](node)) {
                            var space = this[_0x8057[62]][_0x8057[512]]();
                            $(node)[_0x8057[508]](space);
                            this[_0x8057[33]][_0x8057[456]](space);
                        } else {
                            if (tag != _0x8057[516] && this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                                this[_0x8057[33]][_0x8057[454]]($(node)[_0x8057[519]]());
                            } else {
                                this[_0x8057[33]][_0x8057[520]](node, _0x8057[508]);
                            };
                        };
                    } catch (e) {
                        var space = this[_0x8057[62]][_0x8057[512]]();
                        $(node)[_0x8057[508]](space);
                        this[_0x8057[33]][_0x8057[456]](space);
                    };
                },
                setBefore: function(node) {
                    if (this[_0x8057[62]][_0x8057[511]](node)) {
                        this[_0x8057[33]][_0x8057[456]]($(node)[_0x8057[521]]());
                    } else {
                        this[_0x8057[33]][_0x8057[520]](node, _0x8057[510]);
                    };
                },
                setAfterOrBefore: function(node, type) {
                    if (!this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        this[_0x8057[261]][_0x8057[39]]();
                    };
                    node = node[0] || node;
                    this[_0x8057[56]][_0x8057[292]]();
                    if (type == _0x8057[508]) {
                        try {
                            this[_0x8057[313]][_0x8057[522]](node);
                            this[_0x8057[313]][_0x8057[523]](node);
                        } catch (e) {};
                    } else {
                        try {
                            this[_0x8057[313]][_0x8057[524]](node);
                            this[_0x8057[313]][_0x8057[525]](node);
                        } catch (e) {};
                    };
                    this[_0x8057[313]][_0x8057[526]](false);
                    this[_0x8057[56]][_0x8057[518]]();
                },
                getOffsetOfElement: function(node) {
                    node = node[0] || node;
                    this[_0x8057[56]][_0x8057[292]]();
                    var cloned = this[_0x8057[313]][_0x8057[527]]();
                    cloned[_0x8057[528]](node);
                    cloned[_0x8057[456]](this[_0x8057[313]][_0x8057[529]], this[_0x8057[313]][_0x8057[530]]);
                    return $[_0x8057[390]](cloned.toString())[_0x8057[21]];
                },
                getOffset: function() {
                    var offset = 0;
                    var sel = window[_0x8057[531]]();
                    if (sel[_0x8057[532]] > 0) {
                        var range = window[_0x8057[531]]()[_0x8057[533]](0);
                        var caretRange = range[_0x8057[527]]();
                        caretRange[_0x8057[528]](this[_0x8057[261]][0]);
                        caretRange[_0x8057[456]](range[_0x8057[529]], range[_0x8057[530]]);
                        offset = caretRange.toString()[_0x8057[21]];
                    };
                    return offset;
                },
                setOffset: function(start, end) {
                    if (typeof end == _0x8057[14]) {
                        end = start;
                    };
                    if (!this[_0x8057[39]][_0x8057[534]]()) {
                        this[_0x8057[39]][_0x8057[454]]();
                    };
                    var sel = this[_0x8057[56]][_0x8057[292]]();
                    var node, offset = 0;
                    var walker = document[_0x8057[535]](this[_0x8057[261]][0], NodeFilter.SHOW_TEXT, null, null);
                    while (node = walker[_0x8057[537]]()) {
                        offset += node[_0x8057[536]][_0x8057[21]];
                        if (offset > start) {
                            this[_0x8057[313]][_0x8057[454]](node, node[_0x8057[536]][_0x8057[21]] + start - offset);
                            start = Infinity;
                        };
                        if (offset >= end) {
                            this[_0x8057[313]][_0x8057[456]](node, node[_0x8057[536]][_0x8057[21]] + end - offset);
                            break;
                        };
                    };
                    this[_0x8057[313]][_0x8057[526]](false);
                    this[_0x8057[56]][_0x8057[518]]();
                },
                setToPoint: function(start, end) {
                    this[_0x8057[33]][_0x8057[538]](start, end);
                },
                getCoords: function() {
                    return this[_0x8057[33]][_0x8057[489]]();
                }
            };
        },
        clean: function() {
            return {
                onSet: function(html) {
                    html = this[_0x8057[34]][_0x8057[539]](html);
                    html = html[_0x8057[541]](/<script(.*?[^>]?)>([\w\W]*?)<\/script>/gi, _0x8057[540]);
                    html = html[_0x8057[541]](/\$/g, _0x8057[542]);
                    html = html[_0x8057[541]](/”/g, _0x8057[543]);
                    html = html[_0x8057[541]](/‘/g, _0x8057[544]);
                    html = html[_0x8057[541]](/’/g, _0x8057[544]);
                    if (this[_0x8057[63]][_0x8057[545]]) {
                        html = this[_0x8057[34]][_0x8057[545]](html);
                    };
                    if (this[_0x8057[63]][_0x8057[282]]) {
                        html = this[_0x8057[34]][_0x8057[546]](html);
                    };
                    html = this[_0x8057[34]][_0x8057[547]](html);
                    var $div = $(_0x8057[548]);
                    $div[_0x8057[68]](html);
                    var fonts = $div[_0x8057[332]](_0x8057[549]);
                    if (fonts[_0x8057[21]] !== 0) {
                        fonts[_0x8057[284]](function() {
                            var $el = $(this);
                            var $span = $(_0x8057[477])[_0x8057[276]](_0x8057[90], $el[_0x8057[276]](_0x8057[90]));
                            return $span[_0x8057[327]]($el[_0x8057[336]]());
                        });
                        html = $div[_0x8057[68]]();
                    };
                    $div[_0x8057[331]]();
                    html = html[_0x8057[541]](/<font(.*?[^<])>/gi, _0x8057[255]);
                    html = html[_0x8057[541]](/<\/font>/gi, _0x8057[255]);
                    html = this[_0x8057[59]][_0x8057[244]](html);
                    if (this[_0x8057[63]][_0x8057[52]]) {
                        html = this[_0x8057[52]][_0x8057[244]](html);
                    };
                    html = this[_0x8057[34]][_0x8057[550]](html);
                    html = this[_0x8057[34]][_0x8057[551]](html);
                    return html;
                },
                onSync: function(html) {
                    html = html[_0x8057[541]](/[\u200B-\u200D\uFEFF]/g, _0x8057[255]);
                    html = html[_0x8057[541]](/&#x200b;/gi, _0x8057[255]);
                    if (this[_0x8057[63]][_0x8057[552]]) {
                        html = html[_0x8057[541]](/&nbsp;/gi, _0x8057[553]);
                    };
                    if (html[_0x8057[10]](/^<p>(||\s||<br\s?\/?>||&nbsp;)<\/p>$/i) != -1) {
                        return _0x8057[255];
                    };
                    html = html[_0x8057[541]](/<pre class="redactor-script-tag" style="display: none;"(.*?[^>]?)>([\w\W]*?)<\/pre>/gi, _0x8057[554]);
                    html = this[_0x8057[34]][_0x8057[555]](html);
                    var chars = {
                        "\u2122": _0x8057[556],
                        "\xA9": _0x8057[557],
                        "\u2026": _0x8057[558],
                        "\u2014": _0x8057[559],
                        "\u2010": _0x8057[560]
                    };
                    $[_0x8057[20]](chars, function(i, s) {
                        html = html[_0x8057[541]](new RegExp(i, _0x8057[561]), s);
                    });
                    html = html[_0x8057[541]](new RegExp(_0x8057[562], _0x8057[563]), _0x8057[564]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[565], _0x8057[563]), _0x8057[564]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[566], _0x8057[563]), _0x8057[567]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[568], _0x8057[563]), _0x8057[569]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[570], _0x8057[563]), _0x8057[571]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[572], _0x8057[563]), _0x8057[573]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[574], _0x8057[563]), _0x8057[575]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[576], _0x8057[563]), _0x8057[575]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[577], _0x8057[563]), _0x8057[578]);
                    html = html[_0x8057[541]](/ data-save-url="(.*?[^>])"/gi, _0x8057[255]);
                    html = html[_0x8057[541]](/<span(.*?)id="redactor-image-box"(.*?[^>])>([\w\W]*?)<img(.*?)><\/span>/gi, _0x8057[579]);
                    html = html[_0x8057[541]](/<span(.*?)id="redactor-image-resizer"(.*?[^>])>(.*?)<\/span>/gi, _0x8057[255]);
                    html = html[_0x8057[541]](/<span(.*?)id="redactor-image-editter"(.*?[^>])>(.*?)<\/span>/gi, _0x8057[255]);
                    html = html[_0x8057[541]](/<font(.*?[^<])>/gi, _0x8057[255]);
                    html = html[_0x8057[541]](/<\/font>/gi, _0x8057[255]);
                    html = this[_0x8057[59]][_0x8057[244]](html);
                    if (this[_0x8057[63]][_0x8057[580]]) {
                        html = html[_0x8057[541]](/<a(.*?)rel="nofollow"(.*?[^>])>/gi, _0x8057[581]);
                        html = html[_0x8057[541]](/<a(.*?[^>])>/gi, _0x8057[582]);
                    };
                    html = html[_0x8057[541]](/\sdata-redactor-(tag|class|style)="(.*?[^>])"/gi, _0x8057[255]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[568], _0x8057[563]), _0x8057[569]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[583], _0x8057[563]), _0x8057[584]);
                    return html;
                },
                onPaste: function(html, setMode) {
                    html = $[_0x8057[390]](html);
                    html = html[_0x8057[541]](/\$/g, _0x8057[542]);
                    html = html[_0x8057[541]](/‘/g, _0x8057[544]);
                    html = html[_0x8057[541]](/’/g, _0x8057[544]);
                    html = html[_0x8057[541]](/<span class="s1">/gi, _0x8057[477]);
                    html = html[_0x8057[541]](/<span class="Apple-converted-space">&nbsp;<\/span>/gi, _0x8057[553]);
                    html = html[_0x8057[541]](/<span class="Apple-tab-span"[^>]*>\t<\/span>/gi, _0x8057[585]);
                    html = html[_0x8057[541]](/<span[^>]*>(\s|&nbsp;)<\/span>/gi, _0x8057[553]);
                    if (this[_0x8057[63]][_0x8057[586]]) {
                        return this[_0x8057[34]][_0x8057[587]](html);
                    };
                    if (!this[_0x8057[62]][_0x8057[588]]() && typeof setMode == _0x8057[14]) {
                        if (this[_0x8057[62]][_0x8057[590]]([_0x8057[148], _0x8057[589]])) {
                            return this[_0x8057[34]][_0x8057[587]](html, false);
                        };
                        if (this[_0x8057[62]][_0x8057[590]](_0x8057[155])) {
                            html = html[_0x8057[541]](/”/g, _0x8057[543]);
                            html = html[_0x8057[541]](/“/g, _0x8057[543]);
                            return this[_0x8057[34]][_0x8057[591]](html);
                        };
                        if (this[_0x8057[62]][_0x8057[590]]([_0x8057[146], _0x8057[135], _0x8057[136], _0x8057[137], _0x8057[138], _0x8057[139], _0x8057[140]])) {
                            html = this[_0x8057[34]][_0x8057[592]](html);
                            if (!this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                                var block = this[_0x8057[56]][_0x8057[323]]();
                                if (block && block[_0x8057[311]] == _0x8057[134]) {
                                    html = html[_0x8057[541]](/<img(.*?)>/gi, _0x8057[593]);
                                };
                            };
                            return html;
                        };
                        if (this[_0x8057[62]][_0x8057[590]]([_0x8057[145]])) {
                            html = this[_0x8057[34]][_0x8057[594]](html, _0x8057[340]);
                            if (this[_0x8057[63]][_0x8057[282]]) {
                                html = this[_0x8057[34]][_0x8057[546]](html);
                            };
                            html = this[_0x8057[34]][_0x8057[595]](html);
                            return html;
                        };
                        if (this[_0x8057[62]][_0x8057[590]]([_0x8057[158]])) {
                            return this[_0x8057[34]][_0x8057[594]](html, _0x8057[128]);
                        };
                    };
                    html = this[_0x8057[34]][_0x8057[596]](html, setMode);
                    if (!this[_0x8057[34]][_0x8057[597]]) {
                        if (this[_0x8057[63]][_0x8057[282]]) {
                            html = this[_0x8057[34]][_0x8057[546]](html);
                        };
                        if (this[_0x8057[63]][_0x8057[545]]) {
                            html = this[_0x8057[34]][_0x8057[545]](html);
                        };
                        html = this[_0x8057[34]][_0x8057[547]](html);
                    };
                    html = this[_0x8057[34]][_0x8057[598]](html);
                    html = this[_0x8057[34]][_0x8057[599]](html);
                    html = this[_0x8057[34]][_0x8057[594]](html, _0x8057[600]);
                    if (!this[_0x8057[34]][_0x8057[597]] && this[_0x8057[63]][_0x8057[52]]) {
                        html = this[_0x8057[52]][_0x8057[244]](html);
                    };
                    html = this[_0x8057[34]][_0x8057[601]](html);
                    html = this[_0x8057[34]][_0x8057[602]](html);
                    html = this[_0x8057[34]][_0x8057[603]](html);
                    html = this[_0x8057[34]][_0x8057[551]](html);
                    return html;
                },
                onPasteWord: function(html) {
                    html = html[_0x8057[541]](/<!--[\s\S]*?-->/gi, _0x8057[255]);
                    html = html[_0x8057[541]](/<style[^>]*>[\s\S]*?<\/style>/gi, _0x8057[255]);
                    if (/(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/ [_0x8057[604]](html)) {
                        html = this[_0x8057[34]][_0x8057[605]](html);
                        html = html[_0x8057[541]](/<img(.*?)v:shapes=(.*?)>/gi, _0x8057[255]);
                        html = html[_0x8057[541]](/src="file\:\/\/(.*?)"/, _0x8057[606]);
                        html = html[_0x8057[541]](/<p(.*?)class="MsoListParagraphCxSpFirst"([\w\W]*?)<\/p>/gi, _0x8057[607]);
                        html = html[_0x8057[541]](/<p(.*?)class="MsoListParagraphCxSpMiddle"([\w\W]*?)<\/p>/gi, _0x8057[608]);
                        html = html[_0x8057[541]](/<p(.*?)class="MsoListParagraphCxSpLast"([\w\W]*?)<\/p>/gi, _0x8057[609]);
                        html = html[_0x8057[541]](/<p(.*?)class="MsoListParagraph"([\w\W]*?)<\/p>/gi, _0x8057[610]);
                        html = html[_0x8057[541]](/·/g, _0x8057[255]);
                        html = html[_0x8057[541]](/<p class="Mso(.*?)"/gi, _0x8057[611]);
                        html = html[_0x8057[541]](/ class=\"(mso[^\"]*)\"/gi, _0x8057[255]);
                        html = html[_0x8057[541]](/ class=(mso\w+)/gi, _0x8057[255]);
                        html = html[_0x8057[541]](/<o:p(.*?)>([\w\W]*?)<\/o:p>/gi, _0x8057[612]);
                        html = html[_0x8057[541]](/\n/g, _0x8057[553]);
                        html = html[_0x8057[541]](/<p>\n?<li>/gi, _0x8057[507]);
                    };
                    if (this[_0x8057[63]][_0x8057[552]]) {
                        html = html[_0x8057[541]](/(\s|&nbsp;)+/g, _0x8057[553]);
                    };
                    return html;
                },
                onPasteExtra: function(html) {
                    html = html[_0x8057[541]](/<b\sid="internal-source-marker(.*?)">([\w\W]*?)<\/b>/gi, _0x8057[612]);
                    html = html[_0x8057[541]](/<b(.*?)id="docs-internal-guid(.*?)">([\w\W]*?)<\/b>/gi, _0x8057[613]);
                    html = html[_0x8057[541]](/<span[^>]*(font-style: italic; font-weight: bold|font-weight: bold; font-style: italic)[^>]*>/gi, _0x8057[614]);
                    html = html[_0x8057[541]](/<span[^>]*font-style: italic[^>]*>/gi, _0x8057[615]);
                    html = html[_0x8057[541]](/<span[^>]*font-weight: bold[^>]*>/gi, _0x8057[616]);
                    html = html[_0x8057[541]](/<span[^>]*text-decoration: underline[^>]*>/gi, _0x8057[617]);
                    html = html[_0x8057[541]](/<img>/gi, _0x8057[255]);
                    html = html[_0x8057[541]](/\n{3,}/gi, _0x8057[618]);
                    html = html[_0x8057[541]](/<font(.*?)>([\w\W]*?)<\/font>/gi, _0x8057[612]);
                    html = html[_0x8057[541]](/<p><p>/gi, _0x8057[619]);
                    html = html[_0x8057[541]](/<\/p><\/p>/gi, _0x8057[620]);
                    html = html[_0x8057[541]](/<li>(\s*|\t*|\n*)<p>/gi, _0x8057[507]);
                    html = html[_0x8057[541]](/<\/p>(\s*|\t*|\n*)<\/li>/gi, _0x8057[564]);
                    html = html[_0x8057[541]](/<\/p>\s<p/gi, _0x8057[621]);
                    html = html[_0x8057[541]](/<img src="webkit-fake-url\:\/\/(.*?)"(.*?)>/gi, _0x8057[255]);
                    html = html[_0x8057[541]](/<p>•([\w\W]*?)<\/p>/gi, _0x8057[622]);
                    if (this[_0x8057[62]][_0x8057[260]](_0x8057[459])) {
                        html = html[_0x8057[541]](/<br\s?\/?>$/gi, _0x8057[255]);
                    };
                    return html;
                },
                onPasteTidy: function(html, type) {
                    var tags = [_0x8057[101], _0x8057[118], _0x8057[79], _0x8057[78], _0x8057[124], _0x8057[97], _0x8057[95], _0x8057[35], _0x8057[131], _0x8057[132], _0x8057[623], _0x8057[125], _0x8057[133], _0x8057[130], _0x8057[624], _0x8057[122], _0x8057[121], _0x8057[120], _0x8057[123], _0x8057[99], _0x8057[93], _0x8057[127], _0x8057[126], _0x8057[128], _0x8057[342], _0x8057[343], _0x8057[344], _0x8057[77], _0x8057[625], _0x8057[626], _0x8057[627], _0x8057[628], _0x8057[629], _0x8057[630], _0x8057[631], _0x8057[119], _0x8057[362], _0x8057[340], _0x8057[341], _0x8057[363], _0x8057[632], _0x8057[633], _0x8057[634], _0x8057[80], _0x8057[81], _0x8057[82], _0x8057[83], _0x8057[84], _0x8057[85]];
                    var tagsEmpty = false;
                    var attrAllowed = [
                        [_0x8057[118], _0x8057[635]],
                        [_0x8057[119],
                            [_0x8057[636], _0x8057[637]]
                        ],
                        [_0x8057[101],
                            [_0x8057[301], _0x8057[505], _0x8057[638]]
                        ],
                        [_0x8057[628], _0x8057[635]],
                        [_0x8057[626], _0x8057[635]],
                        [_0x8057[627], _0x8057[635]],
                        [_0x8057[629], _0x8057[635]],
                        [_0x8057[631], _0x8057[635]],
                        [_0x8057[630], _0x8057[635]],
                        [_0x8057[291], _0x8057[635]]
                    ];
                    if (type == _0x8057[600]) {
                        tagsEmpty = [_0x8057[77], _0x8057[101], _0x8057[80], _0x8057[81], _0x8057[82], _0x8057[83], _0x8057[84], _0x8057[85]];
                        attrAllowed = [
                            [_0x8057[362], _0x8057[301]],
                            [_0x8057[340],
                                [_0x8057[639], _0x8057[640]]
                            ],
                            [_0x8057[118], _0x8057[635]],
                            [_0x8057[119],
                                [_0x8057[636], _0x8057[637], _0x8057[641]]
                            ],
                            [_0x8057[101],
                                [_0x8057[301], _0x8057[505], _0x8057[638]]
                            ],
                            [_0x8057[628], _0x8057[635]],
                            [_0x8057[626], _0x8057[635]],
                            [_0x8057[627], _0x8057[635]],
                            [_0x8057[629], _0x8057[635]],
                            [_0x8057[631], _0x8057[635]],
                            [_0x8057[630], _0x8057[635]],
                            [_0x8057[291], _0x8057[635]]
                        ];
                    } else {
                        if (type == _0x8057[340]) {
                            tags = [_0x8057[126], _0x8057[127], _0x8057[128], _0x8057[101], _0x8057[118], _0x8057[124], _0x8057[97], _0x8057[95], _0x8057[35], _0x8057[131], _0x8057[132], _0x8057[125], _0x8057[133], _0x8057[130], _0x8057[624], _0x8057[122], _0x8057[121], _0x8057[120], _0x8057[123], _0x8057[99], _0x8057[93], _0x8057[127], _0x8057[126], _0x8057[128], _0x8057[342], _0x8057[343], _0x8057[344], _0x8057[625], _0x8057[628], _0x8057[626], _0x8057[627], _0x8057[629], _0x8057[630], _0x8057[631], _0x8057[119], _0x8057[80], _0x8057[81], _0x8057[82], _0x8057[83], _0x8057[84], _0x8057[85]];
                        } else {
                            if (type == _0x8057[128]) {
                                tags = [_0x8057[126], _0x8057[127], _0x8057[128], _0x8057[101], _0x8057[118], _0x8057[124], _0x8057[97], _0x8057[95], _0x8057[35], _0x8057[131], _0x8057[132], _0x8057[125], _0x8057[133], _0x8057[130], _0x8057[624], _0x8057[122], _0x8057[121], _0x8057[120], _0x8057[123], _0x8057[99], _0x8057[93], _0x8057[625], _0x8057[628], _0x8057[626], _0x8057[627], _0x8057[629], _0x8057[630], _0x8057[631], _0x8057[119]];
                            };
                        };
                    };
                    var options = {
                        deniedTags: false,
                        allowedTags: tags,
                        removeComments: true,
                        removePhp: true,
                        removeAttr: false,
                        allowedAttr: attrAllowed,
                        removeEmpty: tagsEmpty
                    };
                    if (this[_0x8057[63]][_0x8057[642]]) {
                        options[_0x8057[642]] = this[_0x8057[63]][_0x8057[642]];
                    };
                    return this[_0x8057[59]][_0x8057[244]](html, options);
                },
                onPasteRemoveEmpty: function(html) {
                    html = html[_0x8057[541]](/<(p|h[1-6])>(|\s|\n|\t|<br\s?\/?>)<\/(p|h[1-6])>/gi, _0x8057[255]);
                    if (!this[_0x8057[63]][_0x8057[282]]) {
                        html = html[_0x8057[541]](/<br>$/i, _0x8057[255]);
                    };
                    return html;
                },
                onPasteRemoveSpans: function(html) {
                    html = html[_0x8057[541]](/<span>(.*?)<\/span>/gi, _0x8057[578]);
                    html = html[_0x8057[541]](/<span[^>]*>\s|&nbsp;<\/span>/gi, _0x8057[553]);
                    return html;
                },
                onPasteIeFixLinks: function(html) {
                    if (!this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        return html;
                    };
                    var tmp = $[_0x8057[390]](html);
                    if (tmp[_0x8057[10]](/^<a(.*?)>(.*?)<\/a>$/i) === 0) {
                        html = html[_0x8057[541]](/^<a(.*?)>(.*?)<\/a>$/i, _0x8057[612]);
                    };
                    return html;
                },
                isSingleLine: function(html, setMode) {
                    this[_0x8057[34]][_0x8057[597]] = false;
                    if (!this[_0x8057[62]][_0x8057[588]]() && typeof setMode == _0x8057[14]) {
                        var blocks = this[_0x8057[63]][_0x8057[235]][_0x8057[241]](_0x8057[240])[_0x8057[541]](_0x8057[644], _0x8057[255])[_0x8057[541]](_0x8057[643], _0x8057[255]);
                        var matchBlocks = html[_0x8057[647]](new RegExp(_0x8057[645] + blocks + _0x8057[646], _0x8057[563]));
                        var matchContainers = html[_0x8057[647]](/<\/(p|div)>/gi);
                        if (!matchBlocks && (matchContainers === null || (matchContainers && matchContainers[_0x8057[21]] <= 1))) {
                            var matchBR = html[_0x8057[647]](/<br\s?\/?>/gi);
                            var matchIMG = html[_0x8057[647]](/<img(.*?[^>])>/gi);
                            if (!matchBR && !matchIMG) {
                                this[_0x8057[34]][_0x8057[597]] = true;
                                html = html[_0x8057[541]](/<\/?(p|div)(.*?)>/gi, _0x8057[255]);
                            };
                        };
                    };
                    return html;
                },
                stripTags: function(input, allowed) {
                    allowed = (((allowed || _0x8057[255]) + _0x8057[255])[_0x8057[325]]()[_0x8057[647]](/<[a-z][a-z0-9]*>/g) || [])[_0x8057[241]](_0x8057[255]);
                    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
                    return input[_0x8057[541]](tags, function($0, $1) {
                        return allowed[_0x8057[648]](_0x8057[320] + $1[_0x8057[325]]() + _0x8057[321]) > -1 ? $0 : _0x8057[255];
                    });
                },
                savePreCode: function(html) {
                    var pre = html[_0x8057[647]](/<(pre|code)(.*?)>([\w\W]*?)<\/(pre|code)>/gi);
                    if (pre !== null) {
                        $[_0x8057[20]](pre, $[_0x8057[281]](function(i, s) {
                            var arr = s[_0x8057[647]](/<(pre|code)(.*?)>([\w\W]*?)<\/(pre|code)>/i);
                            arr[3] = arr[3][_0x8057[541]](/<br\s?\/?>/g, _0x8057[618]);
                            arr[3] = arr[3][_0x8057[541]](/&nbsp;/g, _0x8057[553]);
                            if (this[_0x8057[63]][_0x8057[649]]) {
                                arr[3] = arr[3][_0x8057[541]](/\t/g, Array(this[_0x8057[63]][_0x8057[649]] + 1)[_0x8057[241]](_0x8057[553]));
                            };
                            arr[3] = this[_0x8057[34]][_0x8057[650]](arr[3]);
                            arr[3] = arr[3][_0x8057[541]](/\$/g, _0x8057[542]);
                            html = html[_0x8057[541]](s, _0x8057[320] + arr[1] + arr[2] + _0x8057[321] + arr[3] + _0x8057[651] + arr[1] + _0x8057[321]);
                        }, this));
                    };
                    return html;
                },
                getTextFromHtml: function(html) {
                    html = html[_0x8057[541]](/<br\s?\/?>|<\/H[1-6]>|<\/p>|<\/div>|<\/li>|<\/td>/gi, _0x8057[618]);
                    var tmp = document[_0x8057[652]](_0x8057[271]);
                    tmp[_0x8057[514]] = html;
                    html = tmp[_0x8057[653]] || tmp[_0x8057[654]];
                    return $[_0x8057[390]](html);
                },
                getPlainText: function(html, paragraphize) {
                    html = this[_0x8057[34]][_0x8057[655]](html);
                    html = html[_0x8057[541]](/\n/g, _0x8057[359]);
                    if (this[_0x8057[63]][_0x8057[52]] && typeof paragraphize == _0x8057[14]) {
                        html = this[_0x8057[52]][_0x8057[244]](html);
                    };
                    return html;
                },
                getPreCode: function(html) {
                    html = html[_0x8057[541]](/<img(.*?) style="(.*?)"(.*?[^>])>/gi, _0x8057[573]);
                    html = html[_0x8057[541]](/<img(.*?)>/gi, _0x8057[656]);
                    html = this[_0x8057[34]][_0x8057[655]](html);
                    if (this[_0x8057[63]][_0x8057[649]]) {
                        html = html[_0x8057[541]](/\t/g, Array(this[_0x8057[63]][_0x8057[649]] + 1)[_0x8057[241]](_0x8057[553]));
                    };
                    html = this[_0x8057[34]][_0x8057[650]](html);
                    return html;
                },
                getOnlyImages: function(html) {
                    html = html[_0x8057[541]](/<img(.*?)>/gi, _0x8057[657]);
                    html = html[_0x8057[541]](/<([Ss]*?)>/gi, _0x8057[255]);
                    html = html[_0x8057[541]](/\[img(.*?)\]/gi, _0x8057[658]);
                    return html;
                },
                getOnlyLinksAndImages: function(html) {
                    html = html[_0x8057[541]](/<a(.*?)href="(.*?)"(.*?)>([\w\W]*?)<\/a>/gi, _0x8057[659]);
                    html = html[_0x8057[541]](/<img(.*?)>/gi, _0x8057[657]);
                    html = html[_0x8057[541]](/<(.*?)>/gi, _0x8057[255]);
                    html = html[_0x8057[541]](/\[a href="(.*?)"\]([\w\W]*?)\[\/a\]/gi, _0x8057[660]);
                    html = html[_0x8057[541]](/\[img(.*?)\]/gi, _0x8057[658]);
                    return html;
                },
                encodeEntities: function(str) {
                    str = String(str)[_0x8057[541]](/&amp;/g, _0x8057[661])[_0x8057[541]](/&lt;/g, _0x8057[320])[_0x8057[541]](/&gt;/g, _0x8057[321])[_0x8057[541]](/&quot;/g, _0x8057[543]);
                    return str[_0x8057[541]](/&/g, _0x8057[665])[_0x8057[541]](/</g, _0x8057[664])[_0x8057[541]](/>/g, _0x8057[663])[_0x8057[541]](/"/g, _0x8057[662]);
                },
                removeDirtyStyles: function(html) {
                    if (this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        return html;
                    };
                    var div = document[_0x8057[652]](_0x8057[271]);
                    div[_0x8057[514]] = html;
                    this[_0x8057[34]][_0x8057[666]]($(div));
                    html = div[_0x8057[514]];
                    $(div)[_0x8057[331]]();
                    return html;
                },
                clearUnverified: function() {
                    if (this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        return;
                    };
                    this[_0x8057[34]][_0x8057[666]](this.$editor);
                    var headers = this[_0x8057[261]][_0x8057[332]](_0x8057[667]);
                    headers[_0x8057[332]](_0x8057[101])[_0x8057[346]](_0x8057[90]);
                    headers[_0x8057[332]](this[_0x8057[63]][_0x8057[669]][_0x8057[241]](_0x8057[668]))[_0x8057[346]](_0x8057[90]);
                    this[_0x8057[35]][_0x8057[270]]();
                },
                clearUnverifiedRemove: function($editor) {
                    $editor[_0x8057[332]](this[_0x8057[63]][_0x8057[669]][_0x8057[241]](_0x8057[668]))[_0x8057[346]](_0x8057[90]);
                    $editor[_0x8057[332]](_0x8057[101])[_0x8057[498]](_0x8057[670])[_0x8057[346]](_0x8057[90]);
                    $editor[_0x8057[332]](_0x8057[671])[_0x8057[20]](function(i, s) {
                        var $s = $(s);
                        $s[_0x8057[276]](_0x8057[90], $s[_0x8057[276]](_0x8057[505]));
                    });
                },
                setVerified: function(html) {
                    if (this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        return html;
                    };
                    html = html[_0x8057[541]](new RegExp(_0x8057[672], _0x8057[563]), _0x8057[673]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[674], _0x8057[563]), _0x8057[675]);
                    var matches = html[_0x8057[647]](new RegExp(_0x8057[676], _0x8057[563]));
                    if (matches) {
                        var len = matches[_0x8057[21]];
                        for (var i = 0; i < len; i++) {
                            try {
                                var newTag = matches[i][_0x8057[541]](/style="(.*?)"/i, _0x8057[677]);
                                html = html[_0x8057[541]](new RegExp(matches[i], _0x8057[563]), newTag);
                            } catch (e) {};
                        };
                    };
                    return html;
                },
                convertInline: function(html) {
                    var $div = $(_0x8057[394])[_0x8057[68]](html);
                    var tags = this[_0x8057[63]][_0x8057[678]];
                    tags[_0x8057[16]](_0x8057[101]);
                    $div[_0x8057[332]](tags[_0x8057[241]](_0x8057[357]))[_0x8057[20]](function() {
                        var $el = $(this);
                        var tag = this[_0x8057[311]][_0x8057[325]]();
                        $el[_0x8057[276]](_0x8057[679], tag);
                        if (tag == _0x8057[101]) {
                            if ($el[_0x8057[276]](_0x8057[90])) {
                                $el[_0x8057[276]](_0x8057[680], $el[_0x8057[276]](_0x8057[90]));
                            } else {
                                if ($el[_0x8057[276]](_0x8057[301])) {
                                    $el[_0x8057[276]](_0x8057[681], $el[_0x8057[276]](_0x8057[301]));
                                };
                            };
                        };
                    });
                    html = $div[_0x8057[68]]();
                    $div[_0x8057[331]]();
                    return html;
                },
                normalizeLists: function() {
                    this[_0x8057[261]][_0x8057[332]](_0x8057[128])[_0x8057[20]](function(i, s) {
                        var $next = $(s)[_0x8057[519]]();
                        if ($next[_0x8057[21]] !== 0 && ($next[0][_0x8057[311]] == _0x8057[156] || $next[0][_0x8057[311]] == _0x8057[157])) {
                            $(s)[_0x8057[327]]($next);
                        };
                    });
                },
                removeSpaces: function(html) {
                    html = html[_0x8057[541]](/\n/g, _0x8057[255]);
                    html = html[_0x8057[541]](/[\t]*/g, _0x8057[255]);
                    html = html[_0x8057[541]](/\n\s*\n/g, _0x8057[618]);
                    html = html[_0x8057[541]](/^[\s\n]*/g, _0x8057[553]);
                    html = html[_0x8057[541]](/[\s\n]*$/g, _0x8057[553]);
                    html = html[_0x8057[541]](/>\s{2,}</g, _0x8057[682]);
                    html = html[_0x8057[541]](/\n\n/g, _0x8057[618]);
                    html = html[_0x8057[541]](/[\u200B-\u200D\uFEFF]/g, _0x8057[255]);
                    return html;
                },
                replaceDivs: function(html) {
                    if (this[_0x8057[63]][_0x8057[282]]) {
                        html = html[_0x8057[541]](/<div><br\s?\/?><\/div>/gi, _0x8057[359]);
                        html = html[_0x8057[541]](/<div(.*?)>([\w\W]*?)<\/div>/gi, _0x8057[683]);
                    } else {
                        html = html[_0x8057[541]](/<div(.*?)>([\w\W]*?)<\/div>/gi, _0x8057[684]);
                    };
                    return html;
                },
                replaceDivsToBr: function(html) {
                    html = html[_0x8057[541]](/<div\s(.*?)>/gi, _0x8057[619]);
                    html = html[_0x8057[541]](/<div><br\s?\/?><\/div>/gi, _0x8057[685]);
                    html = html[_0x8057[541]](/<div>([\w\W]*?)<\/div>/gi, _0x8057[686]);
                    return html;
                },
                replaceParagraphsToBr: function(html) {
                    html = html[_0x8057[541]](/<p\s(.*?)>/gi, _0x8057[619]);
                    html = html[_0x8057[541]](/<p><br\s?\/?><\/p>/gi, _0x8057[359]);
                    html = html[_0x8057[541]](/<p>([\w\W]*?)<\/p>/gi, _0x8057[686]);
                    html = html[_0x8057[541]](/(<br\s?\/?>){1,}\n?<\/blockquote>/gi, _0x8057[687]);
                    return html;
                },
                saveFormTags: function(html) {
                    return html[_0x8057[541]](/<form(.*?)>([\w\W]*?)<\/form>/gi, _0x8057[688]);
                },
                restoreFormTags: function(html) {
                    return html[_0x8057[541]](/<section(.*?) rel="redactor-form-tag"(.*?)>([\w\W]*?)<\/section>/gi, _0x8057[689]);
                }
            };
        },
        code: function() {
            return {
                set: function(html) {
                    html = $[_0x8057[390]](html.toString());
                    html = this[_0x8057[34]][_0x8057[690]](html);
                    this[_0x8057[261]][_0x8057[68]](html);
                    this[_0x8057[35]][_0x8057[270]]();
                    setTimeout($[_0x8057[281]](this[_0x8057[30]][_0x8057[691]], this), 15);
                    if (this[_0x8057[247]] === false) {
                        this[_0x8057[51]][_0x8057[244]]();
                    };
                },
                get: function() {
                    var code = this[_0x8057[288]][_0x8057[388]]();
                    code = this[_0x8057[58]][_0x8057[292]](code);
                    return code;
                },
                sync: function() {
                    setTimeout($[_0x8057[281]](this[_0x8057[35]][_0x8057[692]], this), 10);
                },
                startSync: function() {
                    var html = this[_0x8057[261]][_0x8057[68]]();
                    if (this[_0x8057[35]][_0x8057[693]] && this[_0x8057[35]][_0x8057[693]] == html) {
                        return;
                    };
                    this[_0x8057[35]][_0x8057[693]] = html;
                    html = this[_0x8057[36]][_0x8057[248]](_0x8057[694], html);
                    html = this[_0x8057[34]][_0x8057[695]](html);
                    this[_0x8057[288]][_0x8057[388]](html);
                    this[_0x8057[36]][_0x8057[248]](_0x8057[270], html);
                    if (this[_0x8057[247]] === false) {
                        this[_0x8057[36]][_0x8057[248]](_0x8057[696], html);
                    };
                    this[_0x8057[247]] = false;
                    this[_0x8057[28]][_0x8057[697]]();
                },
                toggle: function() {
                    if (this[_0x8057[63]][_0x8057[401]]) {
                        this[_0x8057[35]][_0x8057[402]]();
                    } else {
                        this[_0x8057[35]][_0x8057[698]]();
                    };
                },
                showCode: function() {
                    this[_0x8057[35]][_0x8057[480]] = this[_0x8057[33]][_0x8057[489]]();
                    var scroll = $(window)[_0x8057[699]]();
                    var height = this[_0x8057[261]][_0x8057[483]]();
                    this[_0x8057[261]][_0x8057[397]]();
                    var html = this[_0x8057[288]][_0x8057[388]]();
                    this[_0x8057[700]] = this[_0x8057[34]][_0x8057[701]](html);
                    html = this[_0x8057[58]][_0x8057[292]](html);
                    this[_0x8057[288]][_0x8057[388]](html)[_0x8057[702]](height)[_0x8057[481]]()[_0x8057[39]]();
                    this[_0x8057[288]][_0x8057[425]](_0x8057[703], this[_0x8057[35]][_0x8057[704]]);
                    $(window)[_0x8057[699]](scroll);
                    if (this[_0x8057[288]][0][_0x8057[705]]) {
                        this[_0x8057[288]][0][_0x8057[705]](0, 0);
                    };
                    this[_0x8057[288]][0][_0x8057[699]] = 0;
                    this[_0x8057[63]][_0x8057[401]] = false;
                    this[_0x8057[32]][_0x8057[706]]();
                    this[_0x8057[32]][_0x8057[707]](_0x8057[68]);
                    this[_0x8057[36]][_0x8057[248]](_0x8057[291], html);
                },
                showVisual: function() {
                    if (this[_0x8057[63]][_0x8057[401]]) {
                        return;
                    };
                    var html = this[_0x8057[288]][_0x8057[397]]()[_0x8057[388]]();
                    if (this[_0x8057[700]] !== this[_0x8057[34]][_0x8057[701]](html)) {
                        this[_0x8057[35]][_0x8057[256]](html);
                    };
                    this[_0x8057[261]][_0x8057[481]]();
                    if (!this[_0x8057[62]][_0x8057[293]](html)) {
                        this[_0x8057[54]][_0x8057[331]]();
                    };
                    this[_0x8057[33]][_0x8057[538]](this[_0x8057[35]][_0x8057[480]]);
                    this[_0x8057[288]][_0x8057[708]](_0x8057[703]);
                    this[_0x8057[32]][_0x8057[709]]();
                    this[_0x8057[32]][_0x8057[710]](_0x8057[68]);
                    this[_0x8057[51]][_0x8057[244]]();
                    this[_0x8057[63]][_0x8057[401]] = true;
                },
                textareaIndenting: function(e) {
                    if (e[_0x8057[711]] !== 9) {
                        return true;
                    };
                    var $el = this[_0x8057[288]];
                    var start = $el[_0x8057[292]](0)[_0x8057[712]];
                    $el[_0x8057[388]]($el[_0x8057[388]]()[_0x8057[713]](0, start) + _0x8057[585] + $el[_0x8057[388]]()[_0x8057[713]]($el[_0x8057[292]](0)[_0x8057[714]]));
                    $el[_0x8057[292]](0)[_0x8057[712]] = $el[_0x8057[292]](0)[_0x8057[714]] = start + 1;
                    return false;
                }
            };
        },
        core: function() {
            return {
                getObject: function() {
                    return $[_0x8057[246]]({}, this);
                },
                getEditor: function() {
                    return this[_0x8057[261]];
                },
                getBox: function() {
                    return this[_0x8057[381]];
                },
                getElement: function() {
                    return this[_0x8057[229]];
                },
                getTextarea: function() {
                    return this[_0x8057[288]];
                },
                getToolbar: function() {
                    return (this[_0x8057[494]]) ? this[_0x8057[494]] : false;
                },
                addEvent: function(name) {
                    this[_0x8057[36]][_0x8057[715]] = name;
                },
                getEvent: function() {
                    return this[_0x8057[36]][_0x8057[715]];
                },
                setCallback: function(type, e, data) {
                    var callback = this[_0x8057[63]][type + _0x8057[716]];
                    if ($[_0x8057[15]](callback)) {
                        return (typeof data == _0x8057[14]) ? callback[_0x8057[6]](this, e) : callback[_0x8057[6]](this, e, data);
                    } else {
                        return (typeof data == _0x8057[14]) ? e : data;
                    };
                },
                destroy: function() {
                    this[_0x8057[36]][_0x8057[248]](_0x8057[717]);
                    this[_0x8057[229]][_0x8057[708]](_0x8057[719])[_0x8057[718]](_0x8057[4]);
                    this[_0x8057[261]][_0x8057[708]](_0x8057[719]);
                    this[_0x8057[261]][_0x8057[350]](_0x8057[720]);
                    this[_0x8057[261]][_0x8057[346]](_0x8057[721]);
                    var html = this[_0x8057[35]][_0x8057[292]]();
                    if (this[_0x8057[31]][_0x8057[387]]()) {
                        this[_0x8057[381]][_0x8057[508]](this.$element);
                        this[_0x8057[381]][_0x8057[331]]();
                        this[_0x8057[229]][_0x8057[388]](html)[_0x8057[481]]();
                    } else {
                        this[_0x8057[381]][_0x8057[508]](this.$editor);
                        this[_0x8057[381]][_0x8057[331]]();
                        this[_0x8057[229]][_0x8057[68]](html)[_0x8057[481]]();
                    };
                    if (this[_0x8057[232]]) {
                        this[_0x8057[232]][_0x8057[331]]();
                    };
                    if (this[_0x8057[722]]) {
                        this[_0x8057[722]][_0x8057[331]]();
                    };
                    if (this[_0x8057[723]]) {
                        this[_0x8057[723]][_0x8057[331]]();
                    };
                    $(_0x8057[724])[_0x8057[331]]();
                    clearInterval(this[_0x8057[290]]);
                }
            };
        },
        dropdown: function() {
            return {
                build: function(name, $dropdown, dropdownObject) {
                    if (name == _0x8057[69] && this[_0x8057[63]][_0x8057[725]]) {
                        $[_0x8057[20]](this[_0x8057[63]][_0x8057[725]], $[_0x8057[281]](function(i, s) {
                            var name = s[_0x8057[303]];
                            if (typeof s[_0x8057[301]] != _0x8057[14]) {
                                name = name + _0x8057[726] + s[_0x8057[301]];
                            };
                            s[_0x8057[265]] = (this[_0x8057[62]][_0x8057[513]](s[_0x8057[303]])) ? _0x8057[29] : _0x8057[42];
                            var func = (s[_0x8057[265]] == _0x8057[42]) ? _0x8057[727] : _0x8057[728];
                            if (this[_0x8057[63]][_0x8057[282]] && s[_0x8057[265]] == _0x8057[29] && s[_0x8057[303]] == _0x8057[77]) {
                                return;
                            };
                            this[_0x8057[69]][name] = {
                                tag: s[_0x8057[303]],
                                style: s[_0x8057[90]],
                                "\x63\x6C\x61\x73\x73": s[_0x8057[301]],
                                attr: s[_0x8057[276]],
                                data: s[_0x8057[9]],
                                clear: s[_0x8057[302]]
                            };
                            dropdownObject[name] = {
                                func: func,
                                title: s[_0x8057[471]]
                            };
                        }, this));
                    };
                    $[_0x8057[20]](dropdownObject, $[_0x8057[281]](function(btnName, btnObject) {
                        var $item = $(_0x8057[729] + btnName + _0x8057[730] + btnObject[_0x8057[471]] + _0x8057[731]);
                        if (name == _0x8057[69]) {
                            $item[_0x8057[347]](_0x8057[732] + btnName);
                        };
                        $item[_0x8057[425]](_0x8057[428], $[_0x8057[281]](function(e) {
                            e[_0x8057[413]]();
                            var type = _0x8057[465];
                            var callback = btnObject[_0x8057[465]];
                            if (btnObject[_0x8057[466]]) {
                                type = _0x8057[466];
                                callback = btnObject[_0x8057[466]];
                            } else {
                                if (btnObject[_0x8057[37]]) {
                                    type = _0x8057[37];
                                    callback = btnObject[_0x8057[37]];
                                };
                            };
                            this[_0x8057[32]][_0x8057[475]](e, btnName, type, callback);
                            this[_0x8057[37]][_0x8057[733]]();
                        }, this));
                        $dropdown[_0x8057[327]]($item);
                    }, this));
                },
                show: function(e, key) {
                    if (!this[_0x8057[63]][_0x8057[401]]) {
                        e[_0x8057[413]]();
                        return false;
                    };
                    var $button = this[_0x8057[32]][_0x8057[292]](key);
                    var $dropdown = $button[_0x8057[9]](_0x8057[37])[_0x8057[478]](document[_0x8057[87]]);
                    if (this[_0x8057[62]][_0x8057[734]]() && !this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        document[_0x8057[735]][_0x8057[446]]();
                    };
                    if ($button[_0x8057[448]](_0x8057[736])) {
                        this[_0x8057[37]][_0x8057[733]]();
                    } else {
                        this[_0x8057[37]][_0x8057[733]]();
                        this[_0x8057[36]][_0x8057[248]](_0x8057[737], {
                            dropdown: $dropdown,
                            key: key,
                            button: $button
                        });
                        this[_0x8057[32]][_0x8057[707]](key);
                        $button[_0x8057[347]](_0x8057[736]);
                        var keyPosition = $button[_0x8057[480]]();
                        var dropdownWidth = $dropdown[_0x8057[738]]();
                        if ((keyPosition[_0x8057[485]] + dropdownWidth) > $(document)[_0x8057[738]]()) {
                            keyPosition[_0x8057[485]] = Math[_0x8057[739]](0, keyPosition[_0x8057[485]] - dropdownWidth);
                        };
                        var left = keyPosition[_0x8057[485]] + _0x8057[484];
                        if (this[_0x8057[494]][_0x8057[448]](_0x8057[740])) {
                            var top = this[_0x8057[494]][_0x8057[483]]() + this[_0x8057[63]][_0x8057[741]];
                            var position = _0x8057[742];
                            if (this[_0x8057[63]][_0x8057[743]] !== document) {
                                top = (this[_0x8057[494]][_0x8057[483]]() + this[_0x8057[494]][_0x8057[480]]()[_0x8057[482]]) + this[_0x8057[63]][_0x8057[741]];
                                position = _0x8057[744];
                            };
                            $dropdown[_0x8057[274]]({
                                position: position,
                                left: left,
                                top: top + _0x8057[484]
                            })[_0x8057[481]]();
                        } else {
                            var top = ($button[_0x8057[483]]() + keyPosition[_0x8057[482]]) + _0x8057[484];
                            $dropdown[_0x8057[274]]({
                                position: _0x8057[744],
                                left: left,
                                top: top
                            })[_0x8057[481]]();
                        };
                        this[_0x8057[36]][_0x8057[248]](_0x8057[745], {
                            dropdown: $dropdown,
                            key: key,
                            button: $button
                        });
                    };
                    $(document)[_0x8057[746]](_0x8057[428], $[_0x8057[281]](this[_0x8057[37]][_0x8057[397]], this));
                    this[_0x8057[261]][_0x8057[746]](_0x8057[428], $[_0x8057[281]](this[_0x8057[37]][_0x8057[397]], this));
                    var $body = $(document[_0x8057[87]]);
                    var width = $body[_0x8057[738]]();
                    $dropdown[_0x8057[425]](_0x8057[479], function() {
                        $body[_0x8057[347]](_0x8057[747]);
                        $body[_0x8057[274]](_0x8057[748], ($body[_0x8057[738]]() - width) + _0x8057[484]);
                    });
                    $dropdown[_0x8057[425]](_0x8057[487], function() {
                        $body[_0x8057[350]](_0x8057[747])[_0x8057[274]](_0x8057[748], 0);
                    });
                    e[_0x8057[749]]();
                },
                hideAll: function() {
                    this[_0x8057[494]][_0x8057[332]](_0x8057[750])[_0x8057[350]](_0x8057[495])[_0x8057[350]](_0x8057[736]);
                    $(document[_0x8057[87]])[_0x8057[350]](_0x8057[747])[_0x8057[274]](_0x8057[748], 0);
                    $(_0x8057[751])[_0x8057[397]]();
                    this[_0x8057[36]][_0x8057[248]](_0x8057[752]);
                },
                hide: function(e) {
                    var $dropdown = $(e[_0x8057[442]]);
                    if (!$dropdown[_0x8057[448]](_0x8057[736])) {
                        $dropdown[_0x8057[350]](_0x8057[736]);
                        this[_0x8057[37]][_0x8057[733]]();
                    };
                }
            };
        },
        file: function() {
            return {
                show: function() {
                    this[_0x8057[50]][_0x8057[244]](_0x8057[38], this[_0x8057[46]][_0x8057[292]](_0x8057[38]), 700);
                    this[_0x8057[61]][_0x8057[22]](_0x8057[753], this[_0x8057[63]][_0x8057[754]], this[_0x8057[38]][_0x8057[43]]);
                    this[_0x8057[56]][_0x8057[262]]();
                    this[_0x8057[56]][_0x8057[292]]();
                    var text = this[_0x8057[755]].toString();
                    $(_0x8057[756])[_0x8057[388]](text);
                    this[_0x8057[50]][_0x8057[481]]();
                },
                insert: function(json, direct, e) {
                    if (typeof json[_0x8057[19]] != _0x8057[14]) {
                        this[_0x8057[50]][_0x8057[757]]();
                        this[_0x8057[56]][_0x8057[269]]();
                        this[_0x8057[36]][_0x8057[248]](_0x8057[758], json);
                        return;
                    };
                    var link;
                    if (typeof json == _0x8057[8]) {
                        link = json;
                    } else {
                        var text = $(_0x8057[756])[_0x8057[388]]();
                        if (typeof text == _0x8057[14] || text === _0x8057[255]) {
                            text = json[_0x8057[759]];
                        };
                        link = _0x8057[760] + json[_0x8057[761]] + _0x8057[762] + text + _0x8057[731];
                    };
                    if (direct) {
                        this[_0x8057[56]][_0x8057[763]]();
                        var marker = this[_0x8057[56]][_0x8057[360]]();
                        this[_0x8057[43]][_0x8057[764]](e, marker);
                    } else {
                        this[_0x8057[50]][_0x8057[757]]();
                    };
                    this[_0x8057[56]][_0x8057[269]]();
                    this[_0x8057[30]][_0x8057[256]]();
                    this[_0x8057[43]][_0x8057[765]](link);
                    if (typeof json == _0x8057[8]) {
                        return;
                    };
                    var linkmarker = $(this[_0x8057[261]][_0x8057[332]](_0x8057[766]));
                    if (linkmarker[_0x8057[21]] !== 0) {
                        linkmarker[_0x8057[346]](_0x8057[386])[_0x8057[346]](_0x8057[90]);
                    } else {
                        linkmarker = false;
                    };
                    this[_0x8057[36]][_0x8057[248]](_0x8057[754], linkmarker, json);
                }
            };
        },
        focus: function() {
            return {
                setStart: function() {
                    this[_0x8057[261]][_0x8057[39]]();
                    var first = this[_0x8057[261]][_0x8057[768]]()[_0x8057[767]]();
                    if (first[_0x8057[21]] === 0) {
                        return;
                    };
                    if (first[0][_0x8057[21]] === 0 || first[0][_0x8057[311]] == _0x8057[516] || first[0][_0x8057[769]] == 3) {
                        return;
                    };
                    if (first[0][_0x8057[311]] == _0x8057[156] || first[0][_0x8057[311]] == _0x8057[157]) {
                        first = first[_0x8057[332]](_0x8057[128])[_0x8057[767]]();
                        var child = first[_0x8057[768]]()[_0x8057[767]]();
                        if (!this[_0x8057[62]][_0x8057[511]](child) && child[_0x8057[770]]() === _0x8057[255]) {
                            this[_0x8057[33]][_0x8057[454]](child);
                            return;
                        };
                    };
                    if (this[_0x8057[63]][_0x8057[282]] && !this[_0x8057[62]][_0x8057[513]](first[0][_0x8057[311]])) {
                        this[_0x8057[56]][_0x8057[292]]();
                        this[_0x8057[313]][_0x8057[454]](this[_0x8057[261]][0], 0);
                        this[_0x8057[313]][_0x8057[456]](this[_0x8057[261]][0], 0);
                        this[_0x8057[56]][_0x8057[518]]();
                        return;
                    };
                    this[_0x8057[33]][_0x8057[454]](first);
                },
                setEnd: function() {
                    if (this[_0x8057[62]][_0x8057[260]](_0x8057[459]) || this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        var last = this[_0x8057[261]][_0x8057[768]]()[_0x8057[771]]();
                        this[_0x8057[33]][_0x8057[456]](last);
                    } else {
                        this[_0x8057[56]][_0x8057[292]]();
                        try {
                            this[_0x8057[313]][_0x8057[528]](this[_0x8057[261]][0]);
                            this[_0x8057[313]][_0x8057[526]](false);
                            this[_0x8057[56]][_0x8057[518]]();
                        } catch (e) {};
                    };
                },
                isFocused: function() {
                    var focusNode = document[_0x8057[531]]()[_0x8057[772]];
                    if (focusNode === null) {
                        return false;
                    };
                    if (this[_0x8057[63]][_0x8057[282]] && $(focusNode[_0x8057[773]])[_0x8057[448]](_0x8057[409])) {
                        return true;
                    } else {
                        if (!this[_0x8057[62]][_0x8057[774]](focusNode[_0x8057[773]])) {
                            return false;
                        };
                    };
                    return this[_0x8057[261]][_0x8057[450]](_0x8057[775]);
                }
            };
        },
        image: function() {
            return {
                show: function() {
                    this[_0x8057[50]][_0x8057[244]](_0x8057[40], this[_0x8057[46]][_0x8057[292]](_0x8057[40]), 700);
                    this[_0x8057[61]][_0x8057[22]](_0x8057[776], this[_0x8057[63]][_0x8057[777]], this[_0x8057[40]][_0x8057[43]]);
                    this[_0x8057[56]][_0x8057[262]]();
                    this[_0x8057[50]][_0x8057[481]]();
                },
                showEdit: function($image) {
                    var $link = $image[_0x8057[352]](_0x8057[118]);
                    this[_0x8057[50]][_0x8057[244]](_0x8057[778], this[_0x8057[46]][_0x8057[292]](_0x8057[779]), 705);
                    this[_0x8057[50]][_0x8057[780]]();
                    this[_0x8057[40]][_0x8057[781]] = this[_0x8057[50]][_0x8057[783]](this[_0x8057[46]][_0x8057[292]](_0x8057[782]));
                    this[_0x8057[40]][_0x8057[784]] = this[_0x8057[50]][_0x8057[785]](this[_0x8057[46]][_0x8057[292]](_0x8057[262]));
                    this[_0x8057[40]][_0x8057[781]][_0x8057[425]](_0x8057[428], $[_0x8057[281]](function() {
                        this[_0x8057[40]][_0x8057[331]]($image);
                    }, this));
                    this[_0x8057[40]][_0x8057[784]][_0x8057[425]](_0x8057[428], $[_0x8057[281]](function() {
                        this[_0x8057[40]][_0x8057[786]]($image);
                    }, this));
                    $(_0x8057[787])[_0x8057[388]]($image[_0x8057[276]](_0x8057[637]));
                    if (!this[_0x8057[63]][_0x8057[788]]) {
                        $(_0x8057[789])[_0x8057[397]]();
                    } else {
                        var $redactorImageLink = $(_0x8057[790]);
                        $redactorImageLink[_0x8057[276]](_0x8057[791], $image[_0x8057[276]](_0x8057[636]));
                        if ($link[_0x8057[21]] !== 0) {
                            $redactorImageLink[_0x8057[388]]($link[_0x8057[276]](_0x8057[791]));
                            if ($link[_0x8057[276]](_0x8057[442]) == _0x8057[792]) {
                                $(_0x8057[795])[_0x8057[794]](_0x8057[793], true);
                            };
                        };
                    };
                    if (!this[_0x8057[63]][_0x8057[796]]) {
                        $(_0x8057[797])[_0x8057[397]]();
                    } else {
                        var floatValue = ($image[_0x8057[274]](_0x8057[798]) == _0x8057[29] && $image[_0x8057[274]](_0x8057[799]) == _0x8057[800]) ? _0x8057[258] : $image[_0x8057[274]](_0x8057[799]);
                        $(_0x8057[801])[_0x8057[388]](floatValue);
                    };
                    this[_0x8057[50]][_0x8057[481]]();
                },
                setFloating: function($image) {
                    var floating = $(_0x8057[801])[_0x8057[388]]();
                    var imageFloat = _0x8057[255];
                    var imageDisplay = _0x8057[255];
                    var imageMargin = _0x8057[255];
                    switch (floating) {
                        case _0x8057[485]:
                            imageFloat = _0x8057[485];
                            imageMargin = _0x8057[802] + this[_0x8057[63]][_0x8057[803]] + _0x8057[553] + this[_0x8057[63]][_0x8057[803]] + _0x8057[804];
                            break;;
                        case _0x8057[257]:
                            imageFloat = _0x8057[257];
                            imageMargin = _0x8057[805] + this[_0x8057[63]][_0x8057[803]] + _0x8057[553] + this[_0x8057[63]][_0x8057[803]];
                            break;;
                        case _0x8057[258]:
                            imageDisplay = _0x8057[29];
                            imageMargin = _0x8057[806];
                            break;;
                    };
                    $image[_0x8057[274]]({
                        "\x66\x6C\x6F\x61\x74": imageFloat,
                        display: imageDisplay,
                        margin: imageMargin
                    });
                    $image[_0x8057[276]](_0x8057[505], $image[_0x8057[276]](_0x8057[90]));
                },
                update: function($image) {
                    this[_0x8057[40]][_0x8057[807]]();
                    this[_0x8057[30]][_0x8057[256]]();
                    var $link = $image[_0x8057[352]](_0x8057[118]);
                    $image[_0x8057[276]](_0x8057[637], $(_0x8057[787])[_0x8057[388]]());
                    this[_0x8057[40]][_0x8057[808]]($image);
                    var link = $[_0x8057[390]]($(_0x8057[790])[_0x8057[388]]());
                    if (link !== _0x8057[255]) {
                        var pattern = _0x8057[809];
                        var re = new RegExp(_0x8057[810] + pattern, _0x8057[123]);
                        var re2 = new RegExp(_0x8057[811] + pattern, _0x8057[123]);
                        if (link[_0x8057[10]](re) == -1 && link[_0x8057[10]](re2) === 0 && this[_0x8057[63]][_0x8057[812]]) {
                            link = this[_0x8057[63]][_0x8057[812]] + _0x8057[813] + link;
                        };
                        var target = ($(_0x8057[795])[_0x8057[794]](_0x8057[793])) ? true : false;
                        if ($link[_0x8057[21]] === 0) {
                            var a = $(_0x8057[760] + link + _0x8057[730] + this[_0x8057[62]][_0x8057[814]]($image) + _0x8057[731]);
                            if (target) {
                                a[_0x8057[276]](_0x8057[442], _0x8057[792]);
                            };
                            $image[_0x8057[284]](a);
                        } else {
                            $link[_0x8057[276]](_0x8057[791], link);
                            if (target) {
                                $link[_0x8057[276]](_0x8057[442], _0x8057[792]);
                            } else {
                                $link[_0x8057[346]](_0x8057[442]);
                            };
                        };
                    } else {
                        if ($link[_0x8057[21]] !== 0) {
                            $link[_0x8057[284]](this[_0x8057[62]][_0x8057[814]]($image));
                        };
                    };
                    this[_0x8057[50]][_0x8057[757]]();
                    this[_0x8057[51]][_0x8057[815]]();
                    this[_0x8057[35]][_0x8057[270]]();
                },
                setEditable: function($image) {
                    if (this[_0x8057[63]][_0x8057[816]]) {
                        $image[_0x8057[425]](_0x8057[817], $[_0x8057[281]](this[_0x8057[40]][_0x8057[818]], this));
                    };
                    $image[_0x8057[425]](_0x8057[441], $[_0x8057[281]](this[_0x8057[40]][_0x8057[807]], this));
                    $image[_0x8057[425]](_0x8057[819], $[_0x8057[281]](function(e) {
                        this[_0x8057[51]][_0x8057[40]] = $image;
                        if (this[_0x8057[261]][_0x8057[332]](_0x8057[820])[_0x8057[21]] !== 0) {
                            return false;
                        };
                        this[_0x8057[40]][_0x8057[821]] = this[_0x8057[40]][_0x8057[822]]($image);
                        $(document)[_0x8057[425]](_0x8057[823], $[_0x8057[281]](this[_0x8057[40]][_0x8057[807]], this));
                        this[_0x8057[261]][_0x8057[425]](_0x8057[823], $[_0x8057[281]](this[_0x8057[40]][_0x8057[807]], this));
                        if (!this[_0x8057[63]][_0x8057[824]]) {
                            return;
                        };
                        this[_0x8057[40]][_0x8057[821]][_0x8057[425]](_0x8057[825], $[_0x8057[281]](function(e) {
                            this[_0x8057[40]][_0x8057[826]](e, $image);
                        }, this));
                    }, this));
                },
                setResizable: function(e, $image) {
                    e[_0x8057[413]]();
                    this[_0x8057[40]][_0x8057[827]] = {
                        x: e[_0x8057[828]],
                        y: e[_0x8057[829]],
                        el: $image,
                        ratio: $image[_0x8057[738]]() / $image[_0x8057[702]](),
                        h: $image[_0x8057[702]]()
                    };
                    e = e[_0x8057[421]] || e;
                    if (e[_0x8057[830]]) {
                        this[_0x8057[40]][_0x8057[827]][_0x8057[831]] = e[_0x8057[830]][0][_0x8057[828]];
                        this[_0x8057[40]][_0x8057[827]][_0x8057[832]] = e[_0x8057[830]][0][_0x8057[829]];
                    };
                    this[_0x8057[40]][_0x8057[833]]();
                },
                startResize: function() {
                    $(document)[_0x8057[425]](_0x8057[834], $[_0x8057[281]](this[_0x8057[40]][_0x8057[835]], this));
                    $(document)[_0x8057[425]](_0x8057[836], $[_0x8057[281]](this[_0x8057[40]][_0x8057[837]], this));
                },
                moveResize: function(e) {
                    e[_0x8057[413]]();
                    e = e[_0x8057[421]] || e;
                    var height = this[_0x8057[40]][_0x8057[827]][_0x8057[838]];
                    if (e[_0x8057[830]]) {
                        height += (e[_0x8057[830]][0][_0x8057[829]] - this[_0x8057[40]][_0x8057[827]][_0x8057[832]]);
                    } else {
                        height += (e[_0x8057[829]] - this[_0x8057[40]][_0x8057[827]][_0x8057[832]]);
                    };
                    var width = Math[_0x8057[840]](height * this[_0x8057[40]][_0x8057[827]][_0x8057[839]]);
                    if (height < 50 || width < 100) {
                        return;
                    };
                    this[_0x8057[40]][_0x8057[827]][_0x8057[841]][_0x8057[738]](width);
                    this[_0x8057[40]][_0x8057[827]][_0x8057[841]][_0x8057[702]](this[_0x8057[40]][_0x8057[827]][_0x8057[841]][_0x8057[738]]() / this[_0x8057[40]][_0x8057[827]][_0x8057[839]]);
                    this[_0x8057[35]][_0x8057[270]]();
                },
                stopResize: function() {
                    this[_0x8057[842]] = false;
                    $(document)[_0x8057[708]](_0x8057[843]);
                    this[_0x8057[40]][_0x8057[807]]();
                },
                onDrag: function(e) {
                    if (this[_0x8057[261]][_0x8057[332]](_0x8057[820])[_0x8057[21]] !== 0) {
                        e[_0x8057[413]]();
                        return false;
                    };
                    this[_0x8057[261]][_0x8057[425]](_0x8057[844], $[_0x8057[281]](function() {
                        setTimeout($[_0x8057[281]](this[_0x8057[40]][_0x8057[845]], this), 1);
                    }, this));
                },
                onDrop: function() {
                    this[_0x8057[40]][_0x8057[846]]();
                    this[_0x8057[51]][_0x8057[815]]();
                    this[_0x8057[261]][_0x8057[708]](_0x8057[844]);
                    this[_0x8057[34]][_0x8057[353]]();
                    this[_0x8057[35]][_0x8057[270]]();
                },
                fixImageSourceAfterDrop: function() {
                    this[_0x8057[261]][_0x8057[332]](_0x8057[848])[_0x8057[20]](function() {
                        var $el = $(this);
                        $el[_0x8057[276]](_0x8057[636], $el[_0x8057[276]](_0x8057[847]));
                        $el[_0x8057[346]](_0x8057[847]);
                    });
                },
                hideResize: function(e) {
                    if (e && $(e[_0x8057[442]])[_0x8057[352]](_0x8057[820])[_0x8057[21]] !== 0) {
                        return;
                    };
                    if (e && e[_0x8057[442]][_0x8057[311]] == _0x8057[849]) {
                        var $image = $(e[_0x8057[442]]);
                        $image[_0x8057[276]](_0x8057[847], $image[_0x8057[276]](_0x8057[636]));
                    };
                    var imageBox = this[_0x8057[261]][_0x8057[332]](_0x8057[820]);
                    if (imageBox[_0x8057[21]] === 0) {
                        return;
                    };
                    if (this[_0x8057[63]][_0x8057[816]]) {
                        this[_0x8057[40]][_0x8057[850]][_0x8057[331]]();
                    };
                    $(this[_0x8057[40]][_0x8057[821]])[_0x8057[331]]();
                    imageBox[_0x8057[332]](_0x8057[119])[_0x8057[274]]({
                        marginTop: imageBox[0][_0x8057[90]][_0x8057[851]],
                        marginBottom: imageBox[0][_0x8057[90]][_0x8057[852]],
                        marginLeft: imageBox[0][_0x8057[90]][_0x8057[853]],
                        marginRight: imageBox[0][_0x8057[90]][_0x8057[854]]
                    });
                    imageBox[_0x8057[274]](_0x8057[855], _0x8057[255]);
                    imageBox[_0x8057[332]](_0x8057[119])[_0x8057[274]](_0x8057[856], _0x8057[255]);
                    imageBox[_0x8057[284]](function() {
                        return $(this)[_0x8057[336]]();
                    });
                    $(document)[_0x8057[708]](_0x8057[823]);
                    this[_0x8057[261]][_0x8057[708]](_0x8057[823]);
                    if (typeof this[_0x8057[40]][_0x8057[827]] !== _0x8057[14]) {
                        this[_0x8057[40]][_0x8057[827]][_0x8057[841]][_0x8057[276]](_0x8057[505], this[_0x8057[40]][_0x8057[827]][_0x8057[841]][_0x8057[276]](_0x8057[90]));
                    };
                    this[_0x8057[35]][_0x8057[270]]();
                },
                loadResizableControls: function($image, imageBox) {
                    if (this[_0x8057[63]][_0x8057[824]] && !this[_0x8057[62]][_0x8057[734]]()) {
                        var imageResizer = $(_0x8057[857]);
                        if (!this[_0x8057[62]][_0x8057[470]]()) {
                            imageResizer[_0x8057[274]]({
                                width: _0x8057[858],
                                height: _0x8057[858]
                            });
                        };
                        imageResizer[_0x8057[276]](_0x8057[721], false);
                        imageBox[_0x8057[327]](imageResizer);
                        imageBox[_0x8057[327]]($image);
                        return imageResizer;
                    } else {
                        imageBox[_0x8057[327]]($image);
                        return false;
                    };
                },
                loadEditableControls: function($image) {
                    var imageBox = $(_0x8057[859]);
                    imageBox[_0x8057[274]](_0x8057[799], $image[_0x8057[274]](_0x8057[799]))[_0x8057[276]](_0x8057[721], false);
                    if ($image[0][_0x8057[90]][_0x8057[855]] != _0x8057[806]) {
                        imageBox[_0x8057[274]]({
                            marginTop: $image[0][_0x8057[90]][_0x8057[851]],
                            marginBottom: $image[0][_0x8057[90]][_0x8057[852]],
                            marginLeft: $image[0][_0x8057[90]][_0x8057[853]],
                            marginRight: $image[0][_0x8057[90]][_0x8057[854]]
                        });
                        $image[_0x8057[274]](_0x8057[855], _0x8057[255]);
                    } else {
                        imageBox[_0x8057[274]]({
                            "\x64\x69\x73\x70\x6C\x61\x79": _0x8057[29],
                            "\x6D\x61\x72\x67\x69\x6E": _0x8057[806]
                        });
                    };
                    $image[_0x8057[274]](_0x8057[856], _0x8057[860])[_0x8057[508]](imageBox);
                    if (this[_0x8057[63]][_0x8057[816]]) {
                        this[_0x8057[40]][_0x8057[850]] = $(_0x8057[861] + this[_0x8057[46]][_0x8057[292]](_0x8057[779]) + _0x8057[862]);
                        this[_0x8057[40]][_0x8057[850]][_0x8057[276]](_0x8057[721], false);
                        this[_0x8057[40]][_0x8057[850]][_0x8057[425]](_0x8057[428], $[_0x8057[281]](function() {
                            this[_0x8057[40]][_0x8057[863]]($image);
                        }, this));
                        imageBox[_0x8057[327]](this[_0x8057[40]][_0x8057[850]]);
                        var editerWidth = this[_0x8057[40]][_0x8057[850]][_0x8057[486]]();
                        this[_0x8057[40]][_0x8057[850]][_0x8057[274]](_0x8057[864], _0x8057[726] + editerWidth / 2 + _0x8057[484]);
                    };
                    return this[_0x8057[40]][_0x8057[865]]($image, imageBox);
                },
                remove: function(image) {
                    var $image = $(image);
                    var $link = $image[_0x8057[352]](_0x8057[118]);
                    var $figure = $image[_0x8057[352]](_0x8057[866]);
                    var $parent = $image[_0x8057[509]]();
                    if ($(_0x8057[820])[_0x8057[21]] !== 0) {
                        $parent = $(_0x8057[820])[_0x8057[509]]();
                    };
                    var $next;
                    if ($figure[_0x8057[21]] !== 0) {
                        $next = $figure[_0x8057[519]]();
                        $figure[_0x8057[331]]();
                    } else {
                        if ($link[_0x8057[21]] !== 0) {
                            $parent = $link[_0x8057[509]]();
                            $link[_0x8057[331]]();
                        } else {
                            $image[_0x8057[331]]();
                        };
                    };
                    $(_0x8057[820])[_0x8057[331]]();
                    if ($figure[_0x8057[21]] !== 0) {
                        this[_0x8057[33]][_0x8057[454]]($next);
                    } else {
                        this[_0x8057[33]][_0x8057[454]]($parent);
                    };
                    this[_0x8057[36]][_0x8057[248]](_0x8057[867], $image[0][_0x8057[636]], $image);
                    this[_0x8057[50]][_0x8057[757]]();
                    this[_0x8057[35]][_0x8057[270]]();
                },
                insert: function(json, direct, e) {
                    if (typeof json[_0x8057[19]] != _0x8057[14]) {
                        this[_0x8057[50]][_0x8057[757]]();
                        this[_0x8057[56]][_0x8057[269]]();
                        this[_0x8057[36]][_0x8057[248]](_0x8057[868], json);
                        return;
                    };
                    var $img;
                    if (typeof json == _0x8057[8]) {
                        $img = $(json)[_0x8057[276]](_0x8057[641], _0x8057[869]);
                    } else {
                        $img = $(_0x8057[870]);
                        $img[_0x8057[276]](_0x8057[636], json[_0x8057[761]])[_0x8057[276]](_0x8057[641], _0x8057[869]);
                    };
                    var node = $img;
                    var isP = this[_0x8057[62]][_0x8057[590]](_0x8057[134]);
                    if (isP) {
                        node = $(_0x8057[871])[_0x8057[327]]($img);
                    };
                    if (direct) {
                        this[_0x8057[56]][_0x8057[763]]();
                        var marker = this[_0x8057[56]][_0x8057[360]]();
                        this[_0x8057[43]][_0x8057[764]](e, marker);
                    } else {
                        this[_0x8057[50]][_0x8057[757]]();
                    };
                    this[_0x8057[56]][_0x8057[269]]();
                    this[_0x8057[30]][_0x8057[256]]();
                    this[_0x8057[43]][_0x8057[68]](this[_0x8057[62]][_0x8057[814]](node), false);
                    var $image = this[_0x8057[261]][_0x8057[332]](_0x8057[872])[_0x8057[346]](_0x8057[641]);
                    if (isP) {
                        $image[_0x8057[509]]()[_0x8057[336]]()[_0x8057[335]]()[_0x8057[272]](_0x8057[873]);
                    } else {
                        if (this[_0x8057[63]][_0x8057[282]]) {
                            $image[_0x8057[510]](_0x8057[326])[_0x8057[508]](_0x8057[326]);
                        };
                    };
                    if (typeof json == _0x8057[8]) {
                        return;
                    };
                    this[_0x8057[36]][_0x8057[248]](_0x8057[777], $image, json);
                }
            };
        },
        indent: function() {
            return {
                increase: function() {
                    if (!this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        this[_0x8057[261]][_0x8057[39]]();
                    };
                    this[_0x8057[30]][_0x8057[256]]();
                    this[_0x8057[56]][_0x8057[262]]();
                    var block = this[_0x8057[56]][_0x8057[323]]();
                    if (block && block[_0x8057[311]] == _0x8057[158]) {
                        this[_0x8057[41]][_0x8057[874]]();
                    } else {
                        if (block === false && this[_0x8057[63]][_0x8057[282]]) {
                            this[_0x8057[41]][_0x8057[875]]();
                        } else {
                            this[_0x8057[41]][_0x8057[876]]();
                        };
                    };
                    this[_0x8057[56]][_0x8057[269]]();
                    this[_0x8057[35]][_0x8057[270]]();
                },
                increaseLists: function() {
                    document[_0x8057[322]](_0x8057[41]);
                    this[_0x8057[41]][_0x8057[877]]();
                    this[_0x8057[34]][_0x8057[878]]();
                    this[_0x8057[34]][_0x8057[353]]();
                },
                increaseBlocks: function() {
                    $[_0x8057[20]](this[_0x8057[56]][_0x8057[264]](), $[_0x8057[281]](function(i, elem) {
                        if (elem[_0x8057[311]] === _0x8057[145] || elem[_0x8057[311]] === _0x8057[318]) {
                            return;
                        };
                        var $el = this[_0x8057[62]][_0x8057[277]](elem);
                        var left = this[_0x8057[62]][_0x8057[879]]($el[_0x8057[274]](_0x8057[864])) + this[_0x8057[63]][_0x8057[880]];
                        $el[_0x8057[274]](_0x8057[864], left + _0x8057[484]);
                    }, this));
                },
                increaseText: function() {
                    var wrapper = this[_0x8057[56]][_0x8057[272]](_0x8057[271]);
                    $(wrapper)[_0x8057[276]](_0x8057[275], _0x8057[4]);
                    $(wrapper)[_0x8057[274]](_0x8057[864], this[_0x8057[63]][_0x8057[880]] + _0x8057[484]);
                },
                decrease: function() {
                    this[_0x8057[30]][_0x8057[256]]();
                    this[_0x8057[56]][_0x8057[262]]();
                    var block = this[_0x8057[56]][_0x8057[323]]();
                    if (block && block[_0x8057[311]] == _0x8057[158]) {
                        this[_0x8057[41]][_0x8057[881]]();
                    } else {
                        this[_0x8057[41]][_0x8057[882]]();
                    };
                    this[_0x8057[56]][_0x8057[269]]();
                    this[_0x8057[35]][_0x8057[270]]();
                },
                decreaseLists: function() {
                    document[_0x8057[322]](_0x8057[75]);
                    var current = this[_0x8057[56]][_0x8057[883]]();
                    var $item = $(current)[_0x8057[352]](_0x8057[128]);
                    var $parent = $item[_0x8057[509]]();
                    if ($item[_0x8057[21]] !== 0 && $parent[_0x8057[21]] !== 0 && $parent[0][_0x8057[311]] == _0x8057[158]) {
                        $parent[_0x8057[508]]($item);
                    };
                    this[_0x8057[41]][_0x8057[877]]();
                    if (!this[_0x8057[63]][_0x8057[282]] && $item[_0x8057[21]] === 0) {
                        document[_0x8057[322]](_0x8057[319], false, _0x8057[77]);
                        this[_0x8057[261]][_0x8057[332]](_0x8057[884])[_0x8057[20]]($[_0x8057[281]](this[_0x8057[62]][_0x8057[355]], this));
                    };
                    this[_0x8057[34]][_0x8057[353]]();
                },
                decreaseBlocks: function() {
                    $[_0x8057[20]](this[_0x8057[56]][_0x8057[264]](), $[_0x8057[281]](function(i, elem) {
                        var $el = this[_0x8057[62]][_0x8057[277]](elem);
                        var left = this[_0x8057[62]][_0x8057[879]]($el[_0x8057[274]](_0x8057[864])) - this[_0x8057[63]][_0x8057[880]];
                        if (left <= 0) {
                            if (this[_0x8057[63]][_0x8057[282]] && typeof($el[_0x8057[9]](_0x8057[283])) !== _0x8057[14]) {
                                $el[_0x8057[284]]($el[_0x8057[68]]() + _0x8057[359]);
                            } else {
                                $el[_0x8057[274]](_0x8057[864], _0x8057[255]);
                                this[_0x8057[62]][_0x8057[285]]($el, _0x8057[90]);
                            };
                        } else {
                            $el[_0x8057[274]](_0x8057[864], left + _0x8057[484]);
                        };
                    }, this));
                },
                fixEmptyIndent: function() {
                    var block = this[_0x8057[56]][_0x8057[323]]();
                    if (this[_0x8057[313]][_0x8057[314]] && block && block[_0x8057[311]] == _0x8057[158] && this[_0x8057[62]][_0x8057[293]]($(block)[_0x8057[770]]())) {
                        var $block = $(block);
                        $block[_0x8057[332]](_0x8057[101])[_0x8057[498]](_0x8057[885])[_0x8057[336]]()[_0x8057[335]]();
                        $block[_0x8057[327]](_0x8057[326]);
                    };
                }
            };
        },
        inline: function() {
            return {
                formatting: function(name) {
                    var type, value;
                    if (typeof this[_0x8057[69]][name][_0x8057[90]] != _0x8057[14]) {
                        type = _0x8057[90];
                    } else {
                        if (typeof this[_0x8057[69]][name][_0x8057[301]] != _0x8057[14]) {
                            type = _0x8057[301];
                        };
                    };
                    if (type) {
                        value = this[_0x8057[69]][name][type];
                    };
                    this[_0x8057[42]][_0x8057[304]](this[_0x8057[69]][name][_0x8057[303]], type, value);
                },
                format: function(tag, type, value) {
                    if (this[_0x8057[62]][_0x8057[590]](_0x8057[155]) || this[_0x8057[62]][_0x8057[886]]()) {
                        return;
                    };
                    var tags = [_0x8057[120], _0x8057[70], _0x8057[123], _0x8057[71], _0x8057[102], _0x8057[887], _0x8057[72], _0x8057[109], _0x8057[110]];
                    var replaced = [_0x8057[95], _0x8057[95], _0x8057[97], _0x8057[97], _0x8057[99], _0x8057[93], _0x8057[93], _0x8057[122], _0x8057[121]];
                    for (var i = 0; i < tags[_0x8057[21]]; i++) {
                        if (tag == tags[i]) {
                            tag = replaced[i];
                        };
                    };
                    this[_0x8057[42]][_0x8057[265]] = type || false;
                    this[_0x8057[42]][_0x8057[309]] = value || false;
                    this[_0x8057[30]][_0x8057[256]]();
                    this[_0x8057[261]][_0x8057[39]]();
                    this[_0x8057[56]][_0x8057[292]]();
                    if (this[_0x8057[313]][_0x8057[314]]) {
                        this[_0x8057[42]][_0x8057[888]](tag);
                    } else {
                        this[_0x8057[42]][_0x8057[889]](tag);
                    };
                },
                formatCollapsed: function(tag) {
                    var current = this[_0x8057[56]][_0x8057[883]]();
                    var $parent = $(current)[_0x8057[352]](tag + _0x8057[890] + tag + _0x8057[891]);
                    if ($parent[_0x8057[21]] !== 0 && (this[_0x8057[42]][_0x8057[265]] != _0x8057[90] && $parent[0][_0x8057[311]] != _0x8057[892])) {
                        this[_0x8057[33]][_0x8057[893]]($parent[0]);
                        if (this[_0x8057[62]][_0x8057[293]]($parent[_0x8057[770]]())) {
                            $parent[_0x8057[331]]();
                            this[_0x8057[35]][_0x8057[270]]();
                        };
                        return;
                    };
                    var node = $(_0x8057[320] + tag + _0x8057[321])[_0x8057[276]](_0x8057[638], _0x8057[4])[_0x8057[276]](_0x8057[679], tag);
                    node[_0x8057[68]](this[_0x8057[63]][_0x8057[515]]);
                    node = this[_0x8057[42]][_0x8057[894]](node);
                    var node = this[_0x8057[43]][_0x8057[895]](node);
                    this[_0x8057[33]][_0x8057[456]](node);
                    this[_0x8057[35]][_0x8057[270]]();
                },
                formatMultiple: function(tag) {
                    this[_0x8057[42]][_0x8057[896]](tag);
                    this[_0x8057[56]][_0x8057[262]]();
                    document[_0x8057[322]](_0x8057[887]);
                    this[_0x8057[261]][_0x8057[332]](_0x8057[92])[_0x8057[20]]($[_0x8057[281]](function(i, s) {
                        var $el = $(s);
                        this[_0x8057[42]][_0x8057[897]]($el, tag);
                        var $span;
                        if (this[_0x8057[42]][_0x8057[265]]) {
                            $span = $(_0x8057[477])[_0x8057[276]](_0x8057[679], tag)[_0x8057[276]](_0x8057[638], _0x8057[4]);
                            $span = this[_0x8057[42]][_0x8057[894]]($span);
                        } else {
                            $span = $(_0x8057[320] + tag + _0x8057[321])[_0x8057[276]](_0x8057[679], tag)[_0x8057[276]](_0x8057[638], _0x8057[4]);
                        };
                        $el[_0x8057[284]]($span[_0x8057[68]]($el[_0x8057[336]]()));
                        if (tag == _0x8057[101]) {
                            var $parent = $span[_0x8057[509]]();
                            if ($parent && $parent[0][_0x8057[311]] == _0x8057[892] && this[_0x8057[42]][_0x8057[265]] == _0x8057[90]) {
                                var arr = this[_0x8057[42]][_0x8057[309]][_0x8057[13]](_0x8057[898]);
                                for (var z = 0; z < arr[_0x8057[21]]; z++) {
                                    if (arr[z] === _0x8057[255]) {
                                        return;
                                    };
                                    var style = arr[z][_0x8057[13]](_0x8057[899]);
                                    $parent[_0x8057[274]](style[0], _0x8057[255]);
                                    if (this[_0x8057[62]][_0x8057[285]]($parent, _0x8057[90])) {
                                        $parent[_0x8057[284]]($parent[_0x8057[336]]());
                                    };
                                };
                            };
                        };
                    }, this));
                    if (tag != _0x8057[101]) {
                        this[_0x8057[261]][_0x8057[332]](this[_0x8057[63]][_0x8057[678]][_0x8057[241]](_0x8057[668]))[_0x8057[20]]($[_0x8057[281]](function(i, s) {
                            var $el = $(s);
                            var property = $el[_0x8057[274]](_0x8057[900]);
                            if (property == _0x8057[901]) {
                                $el[_0x8057[274]](_0x8057[900], _0x8057[255]);
                                this[_0x8057[62]][_0x8057[285]]($el, _0x8057[90]);
                            };
                        }, this));
                    };
                    if (tag != _0x8057[93]) {
                        var _this = this;
                        this[_0x8057[261]][_0x8057[332]](_0x8057[42])[_0x8057[20]](function(i, s) {
                            _this[_0x8057[62]][_0x8057[330]](s, _0x8057[93]);
                        });
                    };
                    this[_0x8057[56]][_0x8057[269]]();
                    this[_0x8057[35]][_0x8057[270]]();
                },
                formatRemoveSameChildren: function($el, tag) {
                    var self = this;
                    $el[_0x8057[768]](tag)[_0x8057[20]](function() {
                        var $child = $(this);
                        if (!$child[_0x8057[448]](_0x8057[902])) {
                            if (self[_0x8057[42]][_0x8057[265]] == _0x8057[90]) {
                                var arr = self[_0x8057[42]][_0x8057[309]][_0x8057[13]](_0x8057[898]);
                                for (var z = 0; z < arr[_0x8057[21]]; z++) {
                                    if (arr[z] === _0x8057[255]) {
                                        return;
                                    };
                                    var style = arr[z][_0x8057[13]](_0x8057[899]);
                                    $child[_0x8057[274]](style[0], _0x8057[255]);
                                    if (self[_0x8057[62]][_0x8057[285]]($child, _0x8057[90])) {
                                        $child[_0x8057[284]]($child[_0x8057[336]]());
                                    };
                                };
                            } else {
                                $child[_0x8057[336]]()[_0x8057[335]]();
                            };
                        };
                    });
                },
                formatConvert: function(tag) {
                    this[_0x8057[56]][_0x8057[262]]();
                    var find = _0x8057[255];
                    if (this[_0x8057[42]][_0x8057[265]] == _0x8057[301]) {
                        find = _0x8057[903] + this[_0x8057[42]][_0x8057[309]] + _0x8057[891];
                    } else {
                        if (this[_0x8057[42]][_0x8057[265]] == _0x8057[90]) {
                            find = _0x8057[904] + this[_0x8057[42]][_0x8057[309]] + _0x8057[905];
                        };
                    };
                    var self = this;
                    if (tag != _0x8057[93]) {
                        this[_0x8057[261]][_0x8057[332]](_0x8057[93])[_0x8057[20]](function(i, s) {
                            self[_0x8057[62]][_0x8057[330]](s, _0x8057[42]);
                        });
                    };
                    if (tag != _0x8057[101]) {
                        this[_0x8057[261]][_0x8057[332]](tag)[_0x8057[20]](function() {
                            var $el = $(this);
                            $el[_0x8057[284]]($(_0x8057[906])[_0x8057[68]]($el[_0x8057[336]]()));
                        });
                    };
                    this[_0x8057[261]][_0x8057[332]](_0x8057[907] + tag + _0x8057[905] + find)[_0x8057[20]](function() {
                        if (find === _0x8057[255] && tag == _0x8057[101] && this[_0x8057[311]][_0x8057[325]]() == tag) {
                            return;
                        };
                        var $el = $(this);
                        $el[_0x8057[284]]($(_0x8057[906])[_0x8057[68]]($el[_0x8057[336]]()));
                    });
                    this[_0x8057[56]][_0x8057[269]]();
                },
                setFormat: function(node) {
                    switch (this[_0x8057[42]][_0x8057[265]]) {
                        case _0x8057[301]:
                            if (node[_0x8057[448]](this[_0x8057[42]][_0x8057[309]])) {
                                node[_0x8057[350]](this[_0x8057[42]][_0x8057[309]]);
                                node[_0x8057[346]](_0x8057[681]);
                            } else {
                                node[_0x8057[347]](this[_0x8057[42]][_0x8057[309]]);
                                node[_0x8057[276]](_0x8057[681], this[_0x8057[42]][_0x8057[309]]);
                            };
                            break;;
                        case _0x8057[90]:
                            node[0][_0x8057[90]][_0x8057[908]] = this[_0x8057[42]][_0x8057[309]];
                            node[_0x8057[276]](_0x8057[680], this[_0x8057[42]][_0x8057[309]]);
                            break;;
                    };
                    return node;
                },
                removeStyle: function() {
                    this[_0x8057[30]][_0x8057[256]]();
                    var current = this[_0x8057[56]][_0x8057[883]]();
                    var nodes = this[_0x8057[56]][_0x8057[909]]();
                    this[_0x8057[56]][_0x8057[262]]();
                    if (current && current[_0x8057[311]] === _0x8057[892]) {
                        var $s = $(current);
                        $s[_0x8057[346]](_0x8057[90]);
                        if ($s[0][_0x8057[910]][_0x8057[21]] === 0) {
                            $s[_0x8057[284]]($s[_0x8057[336]]());
                        };
                    };
                    $[_0x8057[20]](nodes, $[_0x8057[281]](function(i, s) {
                        var $s = $(s);
                        if ($[_0x8057[306]](s[_0x8057[311]][_0x8057[325]](), this[_0x8057[63]][_0x8057[678]]) != -1 && !$s[_0x8057[448]](_0x8057[902])) {
                            $s[_0x8057[346]](_0x8057[90]);
                            if ($s[0][_0x8057[910]][_0x8057[21]] === 0) {
                                $s[_0x8057[284]]($s[_0x8057[336]]());
                            };
                        };
                    }, this));
                    this[_0x8057[56]][_0x8057[269]]();
                    this[_0x8057[35]][_0x8057[270]]();
                },
                removeStyleRule: function(name) {
                    this[_0x8057[30]][_0x8057[256]]();
                    var parent = this[_0x8057[56]][_0x8057[911]]();
                    var nodes = this[_0x8057[56]][_0x8057[909]]();
                    this[_0x8057[56]][_0x8057[262]]();
                    if (parent && parent[_0x8057[311]] === _0x8057[892]) {
                        var $s = $(parent);
                        $s[_0x8057[274]](name, _0x8057[255]);
                        this[_0x8057[62]][_0x8057[285]]($s, _0x8057[90]);
                        if ($s[0][_0x8057[910]][_0x8057[21]] === 0) {
                            $s[_0x8057[284]]($s[_0x8057[336]]());
                        };
                    };
                    $[_0x8057[20]](nodes, $[_0x8057[281]](function(i, s) {
                        var $s = $(s);
                        if ($[_0x8057[306]](s[_0x8057[311]][_0x8057[325]](), this[_0x8057[63]][_0x8057[678]]) != -1 && !$s[_0x8057[448]](_0x8057[902])) {
                            $s[_0x8057[274]](name, _0x8057[255]);
                            this[_0x8057[62]][_0x8057[285]]($s, _0x8057[90]);
                            if ($s[0][_0x8057[910]][_0x8057[21]] === 0) {
                                $s[_0x8057[284]]($s[_0x8057[336]]());
                            };
                        };
                    }, this));
                    this[_0x8057[56]][_0x8057[269]]();
                    this[_0x8057[35]][_0x8057[270]]();
                },
                removeFormat: function() {
                    this[_0x8057[30]][_0x8057[256]]();
                    var current = this[_0x8057[56]][_0x8057[883]]();
                    this[_0x8057[56]][_0x8057[262]]();
                    document[_0x8057[322]](_0x8057[912]);
                    if (current && current[_0x8057[311]] === _0x8057[892]) {
                        $(current)[_0x8057[284]]($(current)[_0x8057[336]]());
                    };
                    $[_0x8057[20]](this[_0x8057[56]][_0x8057[913]](), $[_0x8057[281]](function(i, s) {
                        var $s = $(s);
                        if ($[_0x8057[306]](s[_0x8057[311]][_0x8057[325]](), this[_0x8057[63]][_0x8057[678]]) != -1 && !$s[_0x8057[448]](_0x8057[902])) {
                            $s[_0x8057[284]]($s[_0x8057[336]]());
                        };
                    }, this));
                    this[_0x8057[56]][_0x8057[269]]();
                    this[_0x8057[35]][_0x8057[270]]();
                },
                toggleClass: function(className) {
                    this[_0x8057[42]][_0x8057[304]](_0x8057[101], _0x8057[301], className);
                },
                toggleStyle: function(value) {
                    this[_0x8057[42]][_0x8057[304]](_0x8057[101], _0x8057[90], value);
                }
            };
        },
        insert: function() {
            return {
                set: function(html, clean) {
                    this[_0x8057[54]][_0x8057[331]]();
                    html = this[_0x8057[34]][_0x8057[550]](html);
                    if (typeof clean == _0x8057[14]) {
                        html = this[_0x8057[34]][_0x8057[914]](html, false);
                    };
                    this[_0x8057[261]][_0x8057[68]](html);
                    this[_0x8057[56]][_0x8057[331]]();
                    this[_0x8057[39]][_0x8057[456]]();
                    this[_0x8057[34]][_0x8057[878]]();
                    this[_0x8057[35]][_0x8057[270]]();
                    this[_0x8057[51]][_0x8057[244]]();
                    if (typeof clean == _0x8057[14]) {
                        setTimeout($[_0x8057[281]](this[_0x8057[34]][_0x8057[353]], this), 10);
                    };
                },
                text: function(text) {
                    this[_0x8057[54]][_0x8057[331]]();
                    text = text.toString();
                    text = $[_0x8057[390]](text);
                    text = this[_0x8057[34]][_0x8057[587]](text, false);
                    this[_0x8057[261]][_0x8057[39]]();
                    if (this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        this[_0x8057[43]][_0x8057[915]](text);
                    } else {
                        this[_0x8057[56]][_0x8057[292]]();
                        this[_0x8057[313]][_0x8057[916]]();
                        var el = document[_0x8057[652]](_0x8057[271]);
                        el[_0x8057[514]] = text;
                        var frag = document[_0x8057[917]](),
                            node, lastNode;
                        while ((node = el[_0x8057[919]])) {
                            lastNode = frag[_0x8057[918]](node);
                        };
                        this[_0x8057[313]][_0x8057[920]](frag);
                        if (lastNode) {
                            var range = this[_0x8057[313]][_0x8057[527]]();
                            range[_0x8057[522]](lastNode);
                            range[_0x8057[526]](true);
                            this[_0x8057[755]][_0x8057[921]]();
                            this[_0x8057[755]][_0x8057[518]](range);
                        };
                    };
                    this[_0x8057[35]][_0x8057[270]]();
                    this[_0x8057[34]][_0x8057[353]]();
                },
                htmlWithoutClean: function(html) {
                    this[_0x8057[43]][_0x8057[68]](html, false);
                },
                html: function(html, clean) {
                    this[_0x8057[54]][_0x8057[331]]();
                    if (typeof clean == _0x8057[14]) {
                        clean = true;
                    };
                    this[_0x8057[261]][_0x8057[39]]();
                    html = this[_0x8057[34]][_0x8057[550]](html);
                    if (clean) {
                        html = this[_0x8057[34]][_0x8057[914]](html);
                    };
                    if (this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        this[_0x8057[43]][_0x8057[915]](html);
                    } else {
                        if (this[_0x8057[34]][_0x8057[597]]) {
                            this[_0x8057[43]][_0x8057[922]](html);
                        } else {
                            document[_0x8057[322]](_0x8057[923], false, html);
                        };
                        this[_0x8057[43]][_0x8057[924]]();
                    };
                    this[_0x8057[34]][_0x8057[878]]();
                    if (!this[_0x8057[63]][_0x8057[282]]) {
                        this[_0x8057[261]][_0x8057[332]](_0x8057[77])[_0x8057[20]]($[_0x8057[281]](this[_0x8057[62]][_0x8057[355]], this));
                    };
                    this[_0x8057[35]][_0x8057[270]]();
                    this[_0x8057[51]][_0x8057[244]]();
                    if (clean) {
                        this[_0x8057[34]][_0x8057[353]]();
                    };
                },
                htmlFixMozilla: function() {
                    if (!this[_0x8057[62]][_0x8057[260]](_0x8057[459])) {
                        return;
                    };
                    var $next = $(this[_0x8057[56]][_0x8057[323]]())[_0x8057[519]]();
                    if ($next[_0x8057[21]] > 0 && $next[0][_0x8057[311]] == _0x8057[134] && $next[_0x8057[68]]() === _0x8057[255]) {
                        $next[_0x8057[331]]();
                    };
                },
                htmlIe: function(html) {
                    if (this[_0x8057[62]][_0x8057[925]]()) {
                        var parent = this[_0x8057[62]][_0x8057[590]](_0x8057[134]);
                        var $html = $(_0x8057[548])[_0x8057[327]](html);
                        var blocksMatch = $html[_0x8057[336]]()[_0x8057[450]](_0x8057[926]);
                        if (parent && blocksMatch) {
                            this[_0x8057[43]][_0x8057[927]](parent, html);
                        } else {
                            this[_0x8057[43]][_0x8057[928]](html);
                        };
                        return;
                    };
                    document[_0x8057[56]][_0x8057[930]]()[_0x8057[929]](html);
                },
                execHtml: function(html) {
                    html = this[_0x8057[34]][_0x8057[550]](html);
                    this[_0x8057[56]][_0x8057[292]]();
                    this[_0x8057[313]][_0x8057[916]]();
                    var el = document[_0x8057[652]](_0x8057[271]);
                    el[_0x8057[514]] = html;
                    var frag = document[_0x8057[917]](),
                        node, lastNode;
                    while ((node = el[_0x8057[919]])) {
                        lastNode = frag[_0x8057[918]](node);
                    };
                    this[_0x8057[313]][_0x8057[920]](frag);
                    this[_0x8057[313]][_0x8057[526]](true);
                    this[_0x8057[33]][_0x8057[893]](lastNode);
                },
                node: function(node, deleteContents) {
                    node = node[0] || node;
                    var html = this[_0x8057[62]][_0x8057[814]](node);
                    html = this[_0x8057[34]][_0x8057[550]](html);
                    if (html[_0x8057[647]](/</g) !== null) {
                        node = $(html)[0];
                    };
                    this[_0x8057[56]][_0x8057[292]]();
                    if (deleteContents !== false) {
                        this[_0x8057[313]][_0x8057[916]]();
                    };
                    this[_0x8057[313]][_0x8057[920]](node);
                    this[_0x8057[313]][_0x8057[526]](false);
                    this[_0x8057[56]][_0x8057[518]]();
                    return node;
                },
                nodeToPoint: function(node, x, y) {
                    node = node[0] || node;
                    this[_0x8057[56]][_0x8057[292]]();
                    var range;
                    if (document[_0x8057[931]]) {
                        var pos = document[_0x8057[931]](x, y);
                        this[_0x8057[313]][_0x8057[454]](pos[_0x8057[932]], pos[_0x8057[480]]);
                        this[_0x8057[313]][_0x8057[526]](true);
                        this[_0x8057[313]][_0x8057[920]](node);
                    } else {
                        if (document[_0x8057[933]]) {
                            range = document[_0x8057[933]](x, y);
                            range[_0x8057[920]](node);
                        } else {
                            if (typeof document[_0x8057[87]][_0x8057[934]] != _0x8057[14]) {
                                range = document[_0x8057[87]][_0x8057[934]]();
                                range[_0x8057[935]](x, y);
                                var endRange = range[_0x8057[936]]();
                                endRange[_0x8057[935]](x, y);
                                range[_0x8057[938]](_0x8057[937], endRange);
                                range[_0x8057[939]]();
                            };
                        };
                    };
                },
                nodeToCaretPositionFromPoint: function(e, node) {
                    node = node[0] || node;
                    var range;
                    var x = e[_0x8057[940]],
                        y = e[_0x8057[941]];
                    if (document[_0x8057[931]]) {
                        var pos = document[_0x8057[931]](x, y);
                        var sel = document[_0x8057[531]]();
                        range = sel[_0x8057[533]](0);
                        range[_0x8057[454]](pos[_0x8057[932]], pos[_0x8057[480]]);
                        range[_0x8057[526]](true);
                        range[_0x8057[920]](node);
                    } else {
                        if (document[_0x8057[933]]) {
                            range = document[_0x8057[933]](x, y);
                            range[_0x8057[920]](node);
                        } else {
                            if (typeof document[_0x8057[87]][_0x8057[934]] != _0x8057[14]) {
                                range = document[_0x8057[87]][_0x8057[934]]();
                                range[_0x8057[935]](x, y);
                                var endRange = range[_0x8057[936]]();
                                endRange[_0x8057[935]](x, y);
                                range[_0x8057[938]](_0x8057[937], endRange);
                                range[_0x8057[939]]();
                            };
                        };
                    };
                },
                ie11FixInserting: function(parent, html) {
                    var node = document[_0x8057[652]](_0x8057[101]);
                    node[_0x8057[942]] = _0x8057[943];
                    this[_0x8057[43]][_0x8057[895]](node);
                    var parHtml = $(parent)[_0x8057[68]]();
                    parHtml = _0x8057[619] + parHtml[_0x8057[541]](/<span class="redactor-ie-paste"><\/span>/gi, _0x8057[620] + html + _0x8057[619]) + _0x8057[620];
                    $(parent)[_0x8057[284]](parHtml);
                },
                ie11PasteFrag: function(html) {
                    this[_0x8057[56]][_0x8057[292]]();
                    this[_0x8057[313]][_0x8057[916]]();
                    var el = document[_0x8057[652]](_0x8057[271]);
                    el[_0x8057[514]] = html;
                    var frag = document[_0x8057[917]](),
                        node, lastNode;
                    while ((node = el[_0x8057[919]])) {
                        lastNode = frag[_0x8057[918]](node);
                    };
                    this[_0x8057[313]][_0x8057[920]](frag);
                }
            };
        },
        keydown: function() {
            return {
                init: function(e) {
                    if (this[_0x8057[231]]) {
                        return;
                    };
                    var key = e[_0x8057[944]];
                    var arrow = (key >= 37 && key <= 40);
                    this[_0x8057[44]][_0x8057[945]] = e[_0x8057[946]] || e[_0x8057[947]];
                    this[_0x8057[44]][_0x8057[948]] = this[_0x8057[56]][_0x8057[883]]();
                    this[_0x8057[44]][_0x8057[509]] = this[_0x8057[56]][_0x8057[911]]();
                    this[_0x8057[44]][_0x8057[29]] = this[_0x8057[56]][_0x8057[323]]();
                    this[_0x8057[44]][_0x8057[79]] = this[_0x8057[62]][_0x8057[949]](this[_0x8057[44]][_0x8057[948]], _0x8057[79]);
                    this[_0x8057[44]][_0x8057[78]] = this[_0x8057[62]][_0x8057[949]](this[_0x8057[44]][_0x8057[948]], _0x8057[78]);
                    this[_0x8057[44]][_0x8057[950]] = this[_0x8057[62]][_0x8057[949]](this[_0x8057[44]][_0x8057[948]], _0x8057[950]);
                    this[_0x8057[57]][_0x8057[22]](e, key);
                    this[_0x8057[44]][_0x8057[951]](arrow, key);
                    this[_0x8057[44]][_0x8057[952]](e, key);
                    this[_0x8057[44]][_0x8057[953]](arrow);
                    this[_0x8057[44]][_0x8057[954]](e, key);
                    var keydownStop = this[_0x8057[36]][_0x8057[248]](_0x8057[44], e);
                    if (keydownStop === false) {
                        e[_0x8057[413]]();
                        return false;
                    };
                    if (this[_0x8057[63]][_0x8057[955]] && (this[_0x8057[62]][_0x8057[260]](_0x8057[259]) || this[_0x8057[62]][_0x8057[260]](_0x8057[459])) && (key === this[_0x8057[711]][_0x8057[956]] || key === this[_0x8057[711]][_0x8057[957]])) {
                        var isEndOfTable = false;
                        var $table = false;
                        if (this[_0x8057[44]][_0x8057[29]] && this[_0x8057[44]][_0x8057[29]][_0x8057[311]] === _0x8057[145]) {
                            $table = $(this[_0x8057[44]][_0x8057[29]])[_0x8057[352]](_0x8057[362]);
                        };
                        if ($table && $table[_0x8057[332]](_0x8057[340])[_0x8057[771]]()[0] === this[_0x8057[44]][_0x8057[29]]) {
                            isEndOfTable = true;
                        };
                        if (this[_0x8057[62]][_0x8057[958]]() && isEndOfTable) {
                            var node = $(this[_0x8057[63]][_0x8057[517]]);
                            $table[_0x8057[508]](node);
                            this[_0x8057[33]][_0x8057[454]](node);
                        };
                    };
                    if (this[_0x8057[63]][_0x8057[955]] && key === this[_0x8057[711]][_0x8057[956]]) {
                        this[_0x8057[44]][_0x8057[959]]();
                    };
                    if (!this[_0x8057[63]][_0x8057[955]] && key === this[_0x8057[711]][_0x8057[960]]) {
                        e[_0x8057[413]]();
                        if (!this[_0x8057[313]][_0x8057[314]]) {
                            this[_0x8057[313]][_0x8057[916]]();
                        };
                        return;
                    };
                    if (key == this[_0x8057[711]][_0x8057[960]] && !e[_0x8057[961]] && !e[_0x8057[946]] && !e[_0x8057[947]]) {
                        var stop = this[_0x8057[36]][_0x8057[248]](_0x8057[962], e);
                        if (stop === false) {
                            e[_0x8057[413]]();
                            return false;
                        };
                        if (this[_0x8057[44]][_0x8057[78]] && this[_0x8057[44]][_0x8057[963]](e) === true) {
                            return false;
                        };
                        var current, $next;
                        if (this[_0x8057[44]][_0x8057[79]]) {
                            return this[_0x8057[44]][_0x8057[964]](e);
                        } else {
                            if (this[_0x8057[44]][_0x8057[78]] || this[_0x8057[44]][_0x8057[950]]) {
                                current = this[_0x8057[56]][_0x8057[883]]();
                                $next = $(current)[_0x8057[519]]();
                                if ($next[_0x8057[21]] !== 0 && $next[0][_0x8057[311]] == _0x8057[516]) {
                                    return this[_0x8057[44]][_0x8057[965]](e);
                                } else {
                                    if (this[_0x8057[62]][_0x8057[958]]() && (current && current != _0x8057[892])) {
                                        return this[_0x8057[44]][_0x8057[966]](e);
                                    } else {
                                        return this[_0x8057[44]][_0x8057[965]](e);
                                    };
                                };
                            } else {
                                if (this[_0x8057[63]][_0x8057[282]] && !this[_0x8057[44]][_0x8057[29]]) {
                                    current = this[_0x8057[56]][_0x8057[883]]();
                                    $next = $(this[_0x8057[44]][_0x8057[948]])[_0x8057[519]]();
                                    if (current !== false && $(current)[_0x8057[448]](_0x8057[967])) {
                                        this[_0x8057[33]][_0x8057[893]](current);
                                        $(current)[_0x8057[336]]()[_0x8057[335]]();
                                        return this[_0x8057[44]][_0x8057[966]](e);
                                    } else {
                                        if ($next[_0x8057[21]] === 0 && current === false && typeof $next[_0x8057[968]] != _0x8057[14]) {
                                            return this[_0x8057[44]][_0x8057[966]](e);
                                        } else {
                                            if (this[_0x8057[62]][_0x8057[969]]()) {
                                                return this[_0x8057[44]][_0x8057[966]](e);
                                            };
                                        };
                                        return this[_0x8057[44]][_0x8057[965]](e);
                                    };
                                } else {
                                    if (this[_0x8057[63]][_0x8057[282]] && this[_0x8057[44]][_0x8057[29]]) {
                                        setTimeout($[_0x8057[281]](this[_0x8057[44]][_0x8057[970]], this), 1);
                                    } else {
                                        if (!this[_0x8057[63]][_0x8057[282]] && this[_0x8057[44]][_0x8057[29]] && this[_0x8057[44]][_0x8057[29]][_0x8057[311]] !== _0x8057[158]) {
                                            setTimeout($[_0x8057[281]](this[_0x8057[44]][_0x8057[971]], this), 1);
                                        } else {
                                            if (!this[_0x8057[63]][_0x8057[282]] && !this[_0x8057[44]][_0x8057[29]]) {
                                                return this[_0x8057[44]][_0x8057[972]](e);
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    if (key === this[_0x8057[711]][_0x8057[960]] && (e[_0x8057[946]] || e[_0x8057[961]])) {
                        return this[_0x8057[44]][_0x8057[973]](e);
                    };
                    if (key === this[_0x8057[711]][_0x8057[974]] || e[_0x8057[947]] && key === 221 || e[_0x8057[947]] && key === 219) {
                        return this[_0x8057[44]][_0x8057[975]](e, key);
                    };
                    if (key === this[_0x8057[711]][_0x8057[976]] || key === this[_0x8057[711]][_0x8057[977]]) {
                        var nodes = this[_0x8057[56]][_0x8057[913]]();
                        if (nodes) {
                            var len = nodes[_0x8057[21]];
                            var last;
                            for (var i = 0; i < len; i++) {
                                var children = $(nodes[i])[_0x8057[768]](_0x8057[119]);
                                if (children[_0x8057[21]] !== 0) {
                                    var self = this;
                                    $[_0x8057[20]](children, function(z, s) {
                                        var $s = $(s);
                                        if ($s[_0x8057[274]](_0x8057[799]) != _0x8057[800]) {
                                            return;
                                        };
                                        self[_0x8057[36]][_0x8057[248]](_0x8057[867], s[_0x8057[636]], $s);
                                        last = s;
                                    });
                                } else {
                                    if (nodes[i][_0x8057[311]] == _0x8057[849]) {
                                        if (last != nodes[i]) {
                                            this[_0x8057[36]][_0x8057[248]](_0x8057[867], nodes[i][_0x8057[636]], $(nodes[i]));
                                            last = nodes[i];
                                        };
                                    };
                                };
                            };
                        };
                    };
                    if (key === this[_0x8057[711]][_0x8057[976]]) {
                        this[_0x8057[44]][_0x8057[978]]();
                        this[_0x8057[44]][_0x8057[979]](e);
                    };
                    this[_0x8057[35]][_0x8057[270]]();
                },
                checkEvents: function(arrow, key) {
                    if (!arrow && (this[_0x8057[36]][_0x8057[427]]() == _0x8057[428] || this[_0x8057[36]][_0x8057[427]]() == _0x8057[429])) {
                        this[_0x8057[36]][_0x8057[430]](false);
                        if (this[_0x8057[44]][_0x8057[980]](key)) {
                            this[_0x8057[30]][_0x8057[256]]();
                        };
                    };
                },
                checkKeyEvents: function(key) {
                    var k = this[_0x8057[711]];
                    var keys = [k[_0x8057[976]], k[_0x8057[977]], k[_0x8057[960]], k[_0x8057[981]], k[_0x8057[982]], k[_0x8057[974]], k[_0x8057[983]], k[_0x8057[984]], k[_0x8057[985]], k[_0x8057[986]]];
                    return ($[_0x8057[306]](key, keys) == -1) ? true : false;
                },
                addArrowsEvent: function(arrow) {
                    if (!arrow) {
                        return;
                    };
                    if ((this[_0x8057[36]][_0x8057[427]]() == _0x8057[428] || this[_0x8057[36]][_0x8057[427]]() == _0x8057[429])) {
                        this[_0x8057[36]][_0x8057[430]](false);
                        return;
                    };
                    this[_0x8057[36]][_0x8057[430]](_0x8057[429]);
                },
                setupBuffer: function(e, key) {
                    if (this[_0x8057[44]][_0x8057[945]] && key === 90 && !e[_0x8057[961]] && !e[_0x8057[987]] && this[_0x8057[63]][_0x8057[30]][_0x8057[21]]) {
                        e[_0x8057[413]]();
                        this[_0x8057[30]][_0x8057[367]]();
                        return;
                    } else {
                        if (this[_0x8057[44]][_0x8057[945]] && key === 90 && e[_0x8057[961]] && !e[_0x8057[987]] && this[_0x8057[63]][_0x8057[370]][_0x8057[21]] !== 0) {
                            e[_0x8057[413]]();
                            this[_0x8057[30]][_0x8057[372]]();
                            return;
                        } else {
                            if (!this[_0x8057[44]][_0x8057[945]]) {
                                if (key == this[_0x8057[711]][_0x8057[976]] || key == this[_0x8057[711]][_0x8057[977]] || (key == this[_0x8057[711]][_0x8057[960]] && !e[_0x8057[946]] && !e[_0x8057[961]]) || key == this[_0x8057[711]][_0x8057[981]]) {
                                    this[_0x8057[30]][_0x8057[256]]();
                                };
                            };
                        };
                    };
                },
                setupSelectAll: function(e, key) {
                    if (this[_0x8057[44]][_0x8057[945]] && key === 65) {
                        this[_0x8057[62]][_0x8057[988]]();
                    } else {
                        if (key != this[_0x8057[711]][_0x8057[989]] && !this[_0x8057[44]][_0x8057[945]]) {
                            this[_0x8057[62]][_0x8057[431]]();
                        };
                    };
                },
                onArrowDown: function() {
                    var tags = [this[_0x8057[44]][_0x8057[78]], this[_0x8057[44]][_0x8057[79]], this[_0x8057[44]][_0x8057[950]]];
                    for (var i = 0; i < tags[_0x8057[21]]; i++) {
                        if (tags[i]) {
                            this[_0x8057[44]][_0x8057[990]](tags[i]);
                            return false;
                        };
                    };
                },
                onShiftEnter: function(e) {
                    this[_0x8057[30]][_0x8057[256]]();
                    if (this[_0x8057[62]][_0x8057[958]]()) {
                        return this[_0x8057[44]][_0x8057[966]](e);
                    };
                    return this[_0x8057[44]][_0x8057[965]](e);
                },
                onTab: function(e, key) {
                    if (!this[_0x8057[63]][_0x8057[991]]) {
                        return true;
                    };
                    if (this[_0x8057[62]][_0x8057[293]](this[_0x8057[35]][_0x8057[292]]()) && this[_0x8057[63]][_0x8057[992]] === false) {
                        return true;
                    };
                    e[_0x8057[413]]();
                    var node;
                    if (this[_0x8057[44]][_0x8057[79]] && !e[_0x8057[961]]) {
                        node = (this[_0x8057[63]][_0x8057[649]]) ? document[_0x8057[994]](Array(this[_0x8057[63]][_0x8057[649]] + 1)[_0x8057[241]](_0x8057[993])) : document[_0x8057[994]](_0x8057[585]);
                        this[_0x8057[43]][_0x8057[895]](node);
                        this[_0x8057[35]][_0x8057[270]]();
                    } else {
                        if (this[_0x8057[63]][_0x8057[992]] !== false) {
                            node = document[_0x8057[994]](Array(this[_0x8057[63]][_0x8057[992]] + 1)[_0x8057[241]](_0x8057[993]));
                            this[_0x8057[43]][_0x8057[895]](node);
                            this[_0x8057[35]][_0x8057[270]]();
                        } else {
                            if (e[_0x8057[947]] && key === 219) {
                                this[_0x8057[41]][_0x8057[995]]();
                            } else {
                                if (e[_0x8057[947]] && key === 221) {
                                    this[_0x8057[41]][_0x8057[996]]();
                                } else {
                                    if (!e[_0x8057[961]]) {
                                        this[_0x8057[41]][_0x8057[996]]();
                                    } else {
                                        this[_0x8057[41]][_0x8057[995]]();
                                    };
                                };
                            };
                        };
                    };
                    return false;
                },
                replaceDivToBreakLine: function() {
                    var blockElem = this[_0x8057[56]][_0x8057[323]]();
                    var blockHtml = blockElem[_0x8057[514]][_0x8057[541]](/<br\s?\/?>/gi, _0x8057[255]);
                    if ((blockElem[_0x8057[311]] === _0x8057[144] || blockElem[_0x8057[311]] === _0x8057[134]) && blockHtml === _0x8057[255] && !$(blockElem)[_0x8057[448]](_0x8057[396])) {
                        var br = document[_0x8057[652]](_0x8057[625]);
                        $(blockElem)[_0x8057[284]](br);
                        this[_0x8057[33]][_0x8057[997]](br);
                        this[_0x8057[35]][_0x8057[270]]();
                        return false;
                    };
                },
                replaceDivToParagraph: function() {
                    var blockElem = this[_0x8057[56]][_0x8057[323]]();
                    var blockHtml = blockElem[_0x8057[514]][_0x8057[541]](/<br\s?\/?>/gi, _0x8057[255]);
                    if (blockElem[_0x8057[311]] === _0x8057[144] && blockHtml === _0x8057[255] && !$(blockElem)[_0x8057[448]](_0x8057[396])) {
                        var p = document[_0x8057[652]](_0x8057[77]);
                        p[_0x8057[514]] = this[_0x8057[63]][_0x8057[515]];
                        $(blockElem)[_0x8057[284]](p);
                        this[_0x8057[33]][_0x8057[454]](p);
                        this[_0x8057[35]][_0x8057[270]]();
                        return false;
                    } else {
                        if (this[_0x8057[63]][_0x8057[998]] && blockElem[_0x8057[311]] == _0x8057[134]) {
                            $(blockElem)[_0x8057[346]](_0x8057[301])[_0x8057[346]](_0x8057[90]);
                        };
                    };
                },
                insertParagraph: function(e) {
                    e[_0x8057[413]]();
                    this[_0x8057[56]][_0x8057[292]]();
                    var p = document[_0x8057[652]](_0x8057[77]);
                    p[_0x8057[514]] = this[_0x8057[63]][_0x8057[515]];
                    this[_0x8057[313]][_0x8057[916]]();
                    this[_0x8057[313]][_0x8057[920]](p);
                    this[_0x8057[33]][_0x8057[454]](p);
                    this[_0x8057[35]][_0x8057[270]]();
                    return false;
                },
                exitFromBlockquote: function(e) {
                    if (!this[_0x8057[62]][_0x8057[958]]()) {
                        return;
                    };
                    var tmp = $[_0x8057[390]]($(this[_0x8057[44]][_0x8057[29]])[_0x8057[68]]());
                    if (tmp[_0x8057[10]](/(<br\s?\/?>){2}$/i) != -1) {
                        e[_0x8057[413]]();
                        if (this[_0x8057[63]][_0x8057[282]]) {
                            var br = document[_0x8057[652]](_0x8057[625]);
                            $(this[_0x8057[44]][_0x8057[78]])[_0x8057[508]](br);
                            this[_0x8057[33]][_0x8057[997]](br);
                            $(this[_0x8057[44]][_0x8057[29]])[_0x8057[68]](tmp[_0x8057[541]](/<br\s?\/?>$/i, _0x8057[255]));
                        } else {
                            var node = $(this[_0x8057[63]][_0x8057[517]]);
                            $(this[_0x8057[44]][_0x8057[78]])[_0x8057[508]](node);
                            this[_0x8057[33]][_0x8057[454]](node);
                        };
                        return true;
                    };
                    return;
                },
                insertAfterLastElement: function(element) {
                    if (!this[_0x8057[62]][_0x8057[958]]()) {
                        return;
                    };
                    this[_0x8057[30]][_0x8057[256]]();
                    if (this[_0x8057[63]][_0x8057[282]]) {
                        var contents = $(_0x8057[548])[_0x8057[327]]($[_0x8057[390]](this[_0x8057[261]][_0x8057[68]]()))[_0x8057[336]]();
                        var last = contents[_0x8057[771]]()[0];
                        if (last[_0x8057[311]] == _0x8057[892] && last[_0x8057[514]] === _0x8057[255]) {
                            last = contents[_0x8057[521]]()[0];
                        };
                        if (this[_0x8057[62]][_0x8057[814]](last) != this[_0x8057[62]][_0x8057[814]](element)) {
                            return;
                        };
                        var br = document[_0x8057[652]](_0x8057[625]);
                        $(element)[_0x8057[508]](br);
                        this[_0x8057[33]][_0x8057[893]](br);
                    } else {
                        if (this[_0x8057[261]][_0x8057[336]]()[_0x8057[771]]()[0] !== element) {
                            return;
                        };
                        var node = $(this[_0x8057[63]][_0x8057[517]]);
                        $(element)[_0x8057[508]](node);
                        this[_0x8057[33]][_0x8057[454]](node);
                    };
                },
                insertNewLine: function(e) {
                    e[_0x8057[413]]();
                    var node = document[_0x8057[994]](_0x8057[618]);
                    this[_0x8057[56]][_0x8057[292]]();
                    this[_0x8057[313]][_0x8057[916]]();
                    this[_0x8057[313]][_0x8057[920]](node);
                    this[_0x8057[33]][_0x8057[893]](node);
                    this[_0x8057[35]][_0x8057[270]]();
                    return false;
                },
                insertBreakLine: function(e) {
                    return this[_0x8057[44]][_0x8057[999]](e);
                },
                insertDblBreakLine: function(e) {
                    return this[_0x8057[44]][_0x8057[999]](e, true);
                },
                insertBreakLineProcessing: function(e, dbl) {
                    e[_0x8057[749]]();
                    this[_0x8057[56]][_0x8057[292]]();
                    var br1 = document[_0x8057[652]](_0x8057[625]);
                    this[_0x8057[313]][_0x8057[916]]();
                    this[_0x8057[313]][_0x8057[920]](br1);
                    if (dbl === true) {
                        var br2 = document[_0x8057[652]](_0x8057[625]);
                        this[_0x8057[313]][_0x8057[920]](br2);
                        this[_0x8057[33]][_0x8057[893]](br2);
                    } else {
                        this[_0x8057[33]][_0x8057[893]](br1);
                    };
                    this[_0x8057[35]][_0x8057[270]]();
                    return false;
                },
                removeInvisibleSpace: function() {
                    var $current = $(this[_0x8057[44]][_0x8057[948]]);
                    if ($current[_0x8057[770]]()[_0x8057[10]](/^\u200B$/g) === 0) {
                        $current[_0x8057[331]]();
                    };
                },
                removeEmptyListInTable: function(e) {
                    var $current = $(this[_0x8057[44]][_0x8057[948]]);
                    var $parent = $(this[_0x8057[44]][_0x8057[509]]);
                    var td = $current[_0x8057[352]](_0x8057[340]);
                    if (td[_0x8057[21]] !== 0 && $current[_0x8057[352]](_0x8057[128]) && $parent[_0x8057[768]](_0x8057[128])[_0x8057[21]] === 1) {
                        if (!this[_0x8057[62]][_0x8057[293]]($current[_0x8057[770]]())) {
                            return;
                        };
                        e[_0x8057[413]]();
                        $current[_0x8057[331]]();
                        $parent[_0x8057[331]]();
                        this[_0x8057[33]][_0x8057[454]](td);
                    };
                }
            };
        },
        keyup: function() {
            return {
                init: function(e) {
                    if (this[_0x8057[231]]) {
                        return;
                    };
                    var key = e[_0x8057[944]];
                    this[_0x8057[45]][_0x8057[948]] = this[_0x8057[56]][_0x8057[883]]();
                    this[_0x8057[45]][_0x8057[509]] = this[_0x8057[56]][_0x8057[911]]();
                    var $parent = this[_0x8057[62]][_0x8057[774]]($(this[_0x8057[45]][_0x8057[509]])[_0x8057[509]]());
                    var keyupStop = this[_0x8057[36]][_0x8057[248]](_0x8057[45], e);
                    if (keyupStop === false) {
                        e[_0x8057[413]]();
                        return false;
                    };
                    if (!this[_0x8057[63]][_0x8057[282]] && this[_0x8057[45]][_0x8057[948]][_0x8057[769]] == 3 && this[_0x8057[45]][_0x8057[948]][_0x8057[21]] <= 1 && (this[_0x8057[45]][_0x8057[509]] === false || this[_0x8057[45]][_0x8057[509]][_0x8057[311]] == _0x8057[1000])) {
                        this[_0x8057[45]][_0x8057[1001]]();
                    };
                    if (!this[_0x8057[63]][_0x8057[282]] && this[_0x8057[62]][_0x8057[774]](this[_0x8057[45]][_0x8057[948]]) && this[_0x8057[45]][_0x8057[948]][_0x8057[311]] === _0x8057[144]) {
                        this[_0x8057[45]][_0x8057[1001]](false);
                    };
                    if (!this[_0x8057[63]][_0x8057[282]] && $(this[_0x8057[45]][_0x8057[509]])[_0x8057[448]](_0x8057[967]) && ($parent === false || $parent[0][_0x8057[311]] == _0x8057[1000])) {
                        $(this[_0x8057[45]][_0x8057[509]])[_0x8057[336]]()[_0x8057[335]]();
                        this[_0x8057[45]][_0x8057[1001]]();
                    };
                    if (this[_0x8057[45]][_0x8057[1002]](key)) {
                        this[_0x8057[1008]](this[_0x8057[63]][_0x8057[812]], this[_0x8057[63]][_0x8057[1003]], this[_0x8057[63]][_0x8057[1004]], this[_0x8057[63]][_0x8057[1005]], this[_0x8057[63]][_0x8057[1006]], this[_0x8057[63]][_0x8057[1007]]);
                        this[_0x8057[51]][_0x8057[244]]();
                        this[_0x8057[35]][_0x8057[270]]();
                    };
                    if (key === this[_0x8057[711]][_0x8057[977]] || key === this[_0x8057[711]][_0x8057[976]]) {
                        this[_0x8057[34]][_0x8057[353]]();
                        if (this[_0x8057[51]][_0x8057[40]]) {
                            e[_0x8057[413]]();
                            this[_0x8057[40]][_0x8057[807]]();
                            this[_0x8057[30]][_0x8057[256]]();
                            this[_0x8057[40]][_0x8057[331]](this[_0x8057[51]][_0x8057[40]]);
                            this[_0x8057[51]][_0x8057[40]] = false;
                            return false;
                        };
                        this[_0x8057[261]][_0x8057[332]](_0x8057[77])[_0x8057[20]]($[_0x8057[281]](this[_0x8057[62]][_0x8057[355]], this));
                        if (this[_0x8057[63]][_0x8057[282]] && this[_0x8057[45]][_0x8057[948]] && this[_0x8057[45]][_0x8057[948]][_0x8057[311]] == _0x8057[144] && this[_0x8057[62]][_0x8057[293]](this[_0x8057[45]][_0x8057[948]][_0x8057[514]])) {
                            $(this[_0x8057[45]][_0x8057[948]])[_0x8057[508]](this[_0x8057[56]][_0x8057[1009]]());
                            this[_0x8057[56]][_0x8057[269]]();
                            $(this[_0x8057[45]][_0x8057[948]])[_0x8057[331]]();
                        };
                        return this[_0x8057[45]][_0x8057[1010]](e);
                    };
                },
                isLinkify: function(key) {
                    return this[_0x8057[63]][_0x8057[1003]] && (this[_0x8057[63]][_0x8057[1004]] || this[_0x8057[63]][_0x8057[1005]] || this[_0x8057[63]][_0x8057[1006]]) && key === this[_0x8057[711]][_0x8057[960]] && !this[_0x8057[62]][_0x8057[590]](_0x8057[155]);
                },
                replaceToParagraph: function(clone) {
                    var $current = $(this[_0x8057[45]][_0x8057[948]]);
                    var node;
                    if (clone === false) {
                        node = $(_0x8057[619])[_0x8057[327]]($current[_0x8057[68]]());
                    } else {
                        node = $(_0x8057[619])[_0x8057[327]]($current[_0x8057[1011]]());
                    };
                    $current[_0x8057[284]](node);
                    var next = $(node)[_0x8057[519]]();
                    if (typeof(next[0]) !== _0x8057[14] && next[0][_0x8057[311]] == _0x8057[516]) {
                        next[_0x8057[331]]();
                    };
                    this[_0x8057[33]][_0x8057[456]](node);
                },
                formatEmpty: function(e) {
                    var html = $[_0x8057[390]](this[_0x8057[261]][_0x8057[68]]());
                    if (!this[_0x8057[62]][_0x8057[293]](html)) {
                        return;
                    };
                    e[_0x8057[413]]();
                    if (this[_0x8057[63]][_0x8057[282]]) {
                        this[_0x8057[261]][_0x8057[68]](this[_0x8057[56]][_0x8057[1009]]());
                        this[_0x8057[56]][_0x8057[269]]();
                    } else {
                        html = _0x8057[1012];
                        this[_0x8057[261]][_0x8057[68]](html);
                        this[_0x8057[39]][_0x8057[454]]();
                    };
                    this[_0x8057[35]][_0x8057[270]]();
                    return false;
                }
            };
        },
        lang: function() {
            return {
                load: function() {
                    this[_0x8057[63]][_0x8057[1013]] = this[_0x8057[63]][_0x8057[1014]][this[_0x8057[63]][_0x8057[46]]];
                },
                get: function(name) {
                    return (typeof this[_0x8057[63]][_0x8057[1013]][name] != _0x8057[14]) ? this[_0x8057[63]][_0x8057[1013]][name] : _0x8057[255];
                }
            };
        },
        line: function() {
            return {
                insert: function() {
                    this[_0x8057[30]][_0x8057[256]]();
                    var blocks = this[_0x8057[56]][_0x8057[264]]();
                    if (blocks[0] !== false && this[_0x8057[47]][_0x8057[1015]](blocks)) {
                        if (!this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                            this[_0x8057[261]][_0x8057[39]]();
                        };
                        return;
                    };
                    if (this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        this[_0x8057[47]][_0x8057[1016]]();
                    } else {
                        this[_0x8057[47]][_0x8057[1017]]();
                    };
                },
                isExceptLastOrFirst: function(blocks) {
                    var exceptTags = [_0x8057[128], _0x8057[340], _0x8057[341], _0x8057[78], _0x8057[950], _0x8057[79], _0x8057[342], _0x8057[343], _0x8057[344]];
                    var first = blocks[0][_0x8057[311]][_0x8057[325]]();
                    var last = this[_0x8057[56]][_0x8057[1018]]();
                    last = (typeof last == _0x8057[14]) ? first : last[_0x8057[311]][_0x8057[325]]();
                    var firstFound = $[_0x8057[306]](first, exceptTags) != -1;
                    var lastFound = $[_0x8057[306]](last, exceptTags) != -1;
                    if ((firstFound && lastFound) || firstFound) {
                        return true;
                    };
                },
                insertInIe: function() {
                    this[_0x8057[62]][_0x8057[1019]]();
                    this[_0x8057[30]][_0x8057[256]]();
                    this[_0x8057[43]][_0x8057[895]](document[_0x8057[652]](_0x8057[1020]));
                    this[_0x8057[62]][_0x8057[1021]]();
                    this[_0x8057[35]][_0x8057[270]]();
                },
                insertInOthersBrowsers: function() {
                    this[_0x8057[30]][_0x8057[256]]();
                    var extra = _0x8057[1022];
                    if (this[_0x8057[63]][_0x8057[282]]) {
                        extra = _0x8057[1023];
                    };
                    document[_0x8057[322]](_0x8057[923], false, _0x8057[1024] + extra);
                    this[_0x8057[47]][_0x8057[1025]]();
                    this[_0x8057[35]][_0x8057[270]]();
                },
                setFocus: function() {
                    var node = this[_0x8057[261]][_0x8057[332]](_0x8057[1026]);
                    var next = $(node)[_0x8057[519]]()[0];
                    if (next) {
                        this[_0x8057[33]][_0x8057[893]](node);
                        node[_0x8057[331]]();
                    } else {
                        node[_0x8057[346]](_0x8057[386]);
                    };
                }
            };
        },
        link: function() {
            return {
                show: function(e) {
                    if (typeof e != _0x8057[14] && e[_0x8057[413]]) {
                        e[_0x8057[413]]();
                    };
                    this[_0x8057[50]][_0x8057[244]](_0x8057[48], this[_0x8057[46]][_0x8057[292]](_0x8057[1027]), 600);
                    this[_0x8057[50]][_0x8057[780]]();
                    this[_0x8057[48]][_0x8057[1028]] = this[_0x8057[50]][_0x8057[785]](this[_0x8057[46]][_0x8057[292]](_0x8057[43]));
                    this[_0x8057[56]][_0x8057[292]]();
                    this[_0x8057[48]][_0x8057[1029]]();
                    this[_0x8057[48]][_0x8057[1030]]();
                    if (this[_0x8057[48]][_0x8057[442]] == _0x8057[792]) {
                        $(_0x8057[1031])[_0x8057[794]](_0x8057[793], true);
                    };
                    this[_0x8057[48]][_0x8057[1032]] = $(_0x8057[1033]);
                    this[_0x8057[48]][_0x8057[1034]] = $(_0x8057[1035]);
                    this[_0x8057[48]][_0x8057[1034]][_0x8057[388]](this[_0x8057[48]][_0x8057[770]]);
                    this[_0x8057[48]][_0x8057[1032]][_0x8057[388]](this[_0x8057[48]][_0x8057[1036]]);
                    this[_0x8057[48]][_0x8057[1028]][_0x8057[425]](_0x8057[428], $[_0x8057[281]](this[_0x8057[48]][_0x8057[43]], this));
                    $(_0x8057[1037])[_0x8057[331]]();
                    this[_0x8057[56]][_0x8057[262]]();
                    this[_0x8057[50]][_0x8057[481]]();
                    this[_0x8057[48]][_0x8057[1032]][_0x8057[39]]();
                },
                cleanUrl: function() {
                    var thref = self[_0x8057[1038]][_0x8057[791]][_0x8057[541]](/\/$/i, _0x8057[255]);
                    this[_0x8057[48]][_0x8057[1036]] = this[_0x8057[48]][_0x8057[1036]][_0x8057[541]](thref, _0x8057[255]);
                    this[_0x8057[48]][_0x8057[1036]] = this[_0x8057[48]][_0x8057[1036]][_0x8057[541]](/^\/#/, _0x8057[1039]);
                    this[_0x8057[48]][_0x8057[1036]] = this[_0x8057[48]][_0x8057[1036]][_0x8057[541]](_0x8057[1040], _0x8057[255]);
                    if (!this[_0x8057[63]][_0x8057[812]]) {
                        var re = new RegExp(_0x8057[810] + self[_0x8057[1038]][_0x8057[1041]], _0x8057[123]);
                        this[_0x8057[48]][_0x8057[1036]] = this[_0x8057[48]][_0x8057[1036]][_0x8057[541]](re, _0x8057[255]);
                    };
                },
                getData: function() {
                    this[_0x8057[48]][_0x8057[1042]] = false;
                    var $el = $(this[_0x8057[56]][_0x8057[883]]())[_0x8057[352]](_0x8057[118]);
                    if ($el[_0x8057[21]] !== 0 && $el[0][_0x8057[311]] === _0x8057[589]) {
                        this[_0x8057[48]][_0x8057[1042]] = $el;
                        this[_0x8057[48]][_0x8057[1036]] = $el[_0x8057[276]](_0x8057[791]);
                        this[_0x8057[48]][_0x8057[770]] = $el[_0x8057[770]]();
                        this[_0x8057[48]][_0x8057[442]] = $el[_0x8057[276]](_0x8057[442]);
                    } else {
                        this[_0x8057[48]][_0x8057[770]] = this[_0x8057[755]].toString();
                        this[_0x8057[48]][_0x8057[1036]] = _0x8057[255];
                        this[_0x8057[48]][_0x8057[442]] = _0x8057[255];
                    };
                },
                insert: function() {
                    var target = _0x8057[255];
                    var link = this[_0x8057[48]][_0x8057[1032]][_0x8057[388]]();
                    var text = this[_0x8057[48]][_0x8057[1034]][_0x8057[388]]();
                    if ($[_0x8057[390]](link) === _0x8057[255]) {
                        this[_0x8057[48]][_0x8057[1032]][_0x8057[347]](_0x8057[1043])[_0x8057[425]](_0x8057[45], function() {
                            $(this)[_0x8057[350]](_0x8057[1043]);
                            $(this)[_0x8057[708]](_0x8057[45]);
                        });
                        return;
                    };
                    if (link[_0x8057[10]](_0x8057[1044]) != -1 && /(http|ftp|https):\/\//i [_0x8057[604]](link) === false) {
                        link = _0x8057[1040] + link;
                    } else {
                        if (link[_0x8057[10]](_0x8057[1039]) !== 0) {
                            if ($(_0x8057[1031])[_0x8057[794]](_0x8057[793])) {
                                target = _0x8057[792];
                            };
                            var pattern = _0x8057[809];
                            var re = new RegExp(_0x8057[810] + pattern, _0x8057[123]);
                            var re2 = new RegExp(_0x8057[811] + pattern, _0x8057[123]);
                            var re3 = new RegExp(_0x8057[1045], _0x8057[123]);
                            if (link[_0x8057[10]](re) == -1 && link[_0x8057[10]](re3) == -1 && link[_0x8057[10]](re2) === 0 && this[_0x8057[63]][_0x8057[812]]) {
                                link = this[_0x8057[63]][_0x8057[812]] + _0x8057[813] + link;
                            };
                        };
                    };
                    this[_0x8057[48]][_0x8057[256]](text, link, target);
                    this[_0x8057[50]][_0x8057[757]]();
                },
                set: function(text, link, target) {
                    text = $[_0x8057[390]](text[_0x8057[541]](/<|>/g, _0x8057[255]));
                    this[_0x8057[56]][_0x8057[269]]();
                    if (text === _0x8057[255] && link === _0x8057[255]) {
                        return;
                    };
                    if (text === _0x8057[255] && link !== _0x8057[255]) {
                        text = link;
                    };
                    if (this[_0x8057[48]][_0x8057[1042]]) {
                        this[_0x8057[30]][_0x8057[256]]();
                        this[_0x8057[48]][_0x8057[1042]][_0x8057[770]](text)[_0x8057[276]](_0x8057[791], link);
                        if (target !== _0x8057[255]) {
                            this[_0x8057[48]][_0x8057[1042]][_0x8057[276]](_0x8057[442], target);
                        } else {
                            this[_0x8057[48]][_0x8057[1042]][_0x8057[346]](_0x8057[442]);
                        };
                        this[_0x8057[35]][_0x8057[270]]();
                    } else {
                        if (this[_0x8057[62]][_0x8057[260]](_0x8057[459]) && this[_0x8057[48]][_0x8057[770]] === _0x8057[255]) {
                            var $a = $(_0x8057[1046])[_0x8057[276]](_0x8057[791], link)[_0x8057[770]](text);
                            if (target !== _0x8057[255]) {
                                $a[_0x8057[276]](_0x8057[442], target);
                            };
                            this[_0x8057[43]][_0x8057[895]]($a);
                            this[_0x8057[56]][_0x8057[1047]]($a);
                        } else {
                            var $a;
                            if (this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                                $a = $(_0x8057[760] + link + _0x8057[730])[_0x8057[770]](text);
                                if (target !== _0x8057[255]) {
                                    $a[_0x8057[276]](_0x8057[442], target);
                                };
                                $a = $(this[_0x8057[43]][_0x8057[895]]($a));
                                this[_0x8057[56]][_0x8057[1047]]($a);
                            } else {
                                document[_0x8057[322]](_0x8057[1048], false, link);
                                $a = $(this[_0x8057[56]][_0x8057[883]]())[_0x8057[352]](_0x8057[118]);
                                if (target !== _0x8057[255]) {
                                    $a[_0x8057[276]](_0x8057[442], target);
                                };
                                $a[_0x8057[346]](_0x8057[90]);
                                if (this[_0x8057[48]][_0x8057[770]] === _0x8057[255] || this[_0x8057[48]][_0x8057[770]] != text) {
                                    $a[_0x8057[770]](text);
                                    this[_0x8057[56]][_0x8057[1047]]($a);
                                };
                            };
                        };
                        this[_0x8057[35]][_0x8057[270]]();
                        this[_0x8057[36]][_0x8057[248]](_0x8057[1049], $a);
                    };
                    setTimeout($[_0x8057[281]](function() {
                        this[_0x8057[51]][_0x8057[1050]]();
                    }, this), 5);
                },
                unlink: function(e) {
                    if (typeof e != _0x8057[14] && e[_0x8057[413]]) {
                        e[_0x8057[413]]();
                    };
                    var nodes = this[_0x8057[56]][_0x8057[913]]();
                    if (!nodes) {
                        return;
                    };
                    this[_0x8057[30]][_0x8057[256]]();
                    var len = nodes[_0x8057[21]];
                    for (var i = 0; i < len; i++) {
                        if (nodes[i][_0x8057[311]] == _0x8057[589]) {
                            var $node = $(nodes[i]);
                            $node[_0x8057[284]]($node[_0x8057[336]]());
                        };
                    };
                    $(_0x8057[1037])[_0x8057[331]]();
                    this[_0x8057[35]][_0x8057[270]]();
                }
            };
        },
        list: function() {
            return {
                toggle: function(cmd) {
                    this[_0x8057[54]][_0x8057[331]]();
                    if (!this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        this[_0x8057[261]][_0x8057[39]]();
                    };
                    this[_0x8057[30]][_0x8057[256]]();
                    this[_0x8057[56]][_0x8057[262]]();
                    var parent = this[_0x8057[56]][_0x8057[911]]();
                    var $list = $(parent)[_0x8057[352]](_0x8057[1051]);
                    if (!this[_0x8057[62]][_0x8057[774]]($list) && $list[_0x8057[21]] !== 0) {
                        $list = false;
                    };
                    var isUnorderedCmdOrdered, isOrderedCmdUnordered;
                    var remove = false;
                    if ($list && $list[_0x8057[21]]) {
                        remove = true;
                        var listTag = $list[0][_0x8057[311]];
                        isUnorderedCmdOrdered = (cmd === _0x8057[74] && listTag === _0x8057[156]);
                        isOrderedCmdUnordered = (cmd === _0x8057[73] && listTag === _0x8057[157]);
                    };
                    if (isUnorderedCmdOrdered) {
                        this[_0x8057[62]][_0x8057[330]]($list, _0x8057[127]);
                    } else {
                        if (isOrderedCmdUnordered) {
                            this[_0x8057[62]][_0x8057[330]]($list, _0x8057[126]);
                        } else {
                            if (remove) {
                                this[_0x8057[49]][_0x8057[331]](cmd);
                            } else {
                                this[_0x8057[49]][_0x8057[43]](cmd);
                            };
                        };
                    };
                    this[_0x8057[56]][_0x8057[269]]();
                    this[_0x8057[35]][_0x8057[270]]();
                },
                insert: function(cmd) {
                    var parent = this[_0x8057[56]][_0x8057[911]]();
                    var current = this[_0x8057[56]][_0x8057[883]]();
                    var $td = $(current)[_0x8057[352]](_0x8057[1052]);
                    if (this[_0x8057[62]][_0x8057[260]](_0x8057[259]) && this[_0x8057[63]][_0x8057[282]]) {
                        this[_0x8057[49]][_0x8057[1016]](cmd);
                    } else {
                        document[_0x8057[322]](_0x8057[43] + cmd);
                    };
                    var $list = $(this[_0x8057[56]][_0x8057[911]]())[_0x8057[352]](_0x8057[1051]);
                    if ($td[_0x8057[21]] !== 0) {
                        var prev = $td[_0x8057[521]]();
                        var html = $td[_0x8057[68]]();
                        $td[_0x8057[68]](_0x8057[255]);
                        if (prev && prev[_0x8057[21]] === 1 && (prev[0][_0x8057[311]] === _0x8057[145] || prev[0][_0x8057[311]] === _0x8057[318])) {
                            $(prev)[_0x8057[508]]($td);
                        } else {
                            $(parent)[_0x8057[328]]($td);
                        };
                        $td[_0x8057[68]](html);
                    };
                    if (this[_0x8057[62]][_0x8057[293]]($list[_0x8057[332]](_0x8057[128])[_0x8057[770]]())) {
                        var $children = $list[_0x8057[768]](_0x8057[128]);
                        $children[_0x8057[332]](_0x8057[625])[_0x8057[331]]();
                        $children[_0x8057[327]](this[_0x8057[56]][_0x8057[1009]]());
                    };
                    if ($list[_0x8057[21]]) {
                        var $listParent = $list[_0x8057[509]]();
                        if (this[_0x8057[62]][_0x8057[774]]($listParent) && $listParent[0][_0x8057[311]] != _0x8057[158] && this[_0x8057[62]][_0x8057[511]]($listParent[0])) {
                            $listParent[_0x8057[284]]($listParent[_0x8057[336]]());
                        };
                    };
                    if (!this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        this[_0x8057[261]][_0x8057[39]]();
                    };
                    this[_0x8057[34]][_0x8057[353]]();
                },
                insertInIe: function(cmd) {
                    var wrapper = this[_0x8057[56]][_0x8057[272]](_0x8057[271]);
                    var wrapperHtml = $(wrapper)[_0x8057[68]]();
                    var tmpList = (cmd == _0x8057[74]) ? $(_0x8057[1053]) : $(_0x8057[1054]);
                    var tmpLi = $(_0x8057[507]);
                    if ($[_0x8057[390]](wrapperHtml) === _0x8057[255]) {
                        tmpLi[_0x8057[327]](this[_0x8057[56]][_0x8057[1009]]());
                        tmpList[_0x8057[327]](tmpLi);
                        this[_0x8057[261]][_0x8057[332]](_0x8057[1055])[_0x8057[284]](tmpList);
                    } else {
                        var items = wrapperHtml[_0x8057[13]](/<br\s?\/?>/gi);
                        if (items) {
                            for (var i = 0; i < items[_0x8057[21]]; i++) {
                                if ($[_0x8057[390]](items[i]) !== _0x8057[255]) {
                                    tmpList[_0x8057[327]]($(_0x8057[507])[_0x8057[68]](items[i]));
                                };
                            };
                        } else {
                            tmpLi[_0x8057[327]](wrapperHtml);
                            tmpList[_0x8057[327]](tmpLi);
                        };
                        $(wrapper)[_0x8057[284]](tmpList);
                    };
                },
                remove: function(cmd) {
                    document[_0x8057[322]](_0x8057[43] + cmd);
                    var $current = $(this[_0x8057[56]][_0x8057[883]]());
                    this[_0x8057[41]][_0x8057[877]]();
                    if (!this[_0x8057[63]][_0x8057[282]] && $current[_0x8057[352]](_0x8057[1056])[_0x8057[21]] === 0) {
                        document[_0x8057[322]](_0x8057[319], false, _0x8057[77]);
                        this[_0x8057[261]][_0x8057[332]](_0x8057[1057])[_0x8057[20]]($[_0x8057[281]](this[_0x8057[62]][_0x8057[355]], this));
                    };
                    var $table = $(this[_0x8057[56]][_0x8057[883]]())[_0x8057[352]](_0x8057[362]);
                    var $prev = $table[_0x8057[521]]();
                    if (!this[_0x8057[63]][_0x8057[282]] && $table[_0x8057[21]] !== 0 && $prev[_0x8057[21]] !== 0 && $prev[0][_0x8057[311]] == _0x8057[516]) {
                        $prev[_0x8057[331]]();
                    };
                    this[_0x8057[34]][_0x8057[353]]();
                }
            };
        },
        modal: function() {
            return {
                callbacks: {},
                loadTemplates: function() {
                    this[_0x8057[63]][_0x8057[50]] = {
                        imageEdit: String() + _0x8057[1058] + _0x8057[1059] + this[_0x8057[46]][_0x8057[292]](_0x8057[471]) + _0x8057[1060] + _0x8057[1061] + _0x8057[1062] + this[_0x8057[46]][_0x8057[292]](_0x8057[48]) + _0x8057[1060] + _0x8057[1063] + _0x8057[1064] + this[_0x8057[46]][_0x8057[292]](_0x8057[1065]) + _0x8057[1060] + _0x8057[1066] + this[_0x8057[46]][_0x8057[292]](_0x8057[1067]) + _0x8057[1060] + _0x8057[1068] + _0x8057[1069] + this[_0x8057[46]][_0x8057[292]](_0x8057[800]) + _0x8057[1070] + _0x8057[1071] + this[_0x8057[46]][_0x8057[292]](_0x8057[485]) + _0x8057[1070] + _0x8057[1072] + this[_0x8057[46]][_0x8057[292]](_0x8057[258]) + _0x8057[1070] + _0x8057[1073] + this[_0x8057[46]][_0x8057[292]](_0x8057[257]) + _0x8057[1070] + _0x8057[1074] + _0x8057[1075],
                        image: String() + _0x8057[1076] + _0x8057[1077] + _0x8057[1075],
                        file: String() + _0x8057[1078] + _0x8057[1079] + _0x8057[1059] + this[_0x8057[46]][_0x8057[292]](_0x8057[759]) + _0x8057[1060] + _0x8057[1080] + _0x8057[1081] + _0x8057[1082] + _0x8057[1075],
                        link: String() + _0x8057[1083] + _0x8057[1084] + _0x8057[1085] + _0x8057[1059] + this[_0x8057[46]][_0x8057[292]](_0x8057[770]) + _0x8057[1060] + _0x8057[1086] + _0x8057[1087] + this[_0x8057[46]][_0x8057[292]](_0x8057[1065]) + _0x8057[1060] + _0x8057[1075]
                    };
                    $[_0x8057[246]](this[_0x8057[63]], this[_0x8057[63]][_0x8057[50]]);
                },
                addCallback: function(name, callback) {
                    this[_0x8057[50]][_0x8057[1088]][name] = callback;
                },
                createTabber: function($modal) {
                    this[_0x8057[50]][_0x8057[1089]] = $(_0x8057[548])[_0x8057[276]](_0x8057[386], _0x8057[1090]);
                    $modal[_0x8057[328]](this[_0x8057[50]].$tabber);
                },
                addTab: function(id, name, active) {
                    var $tab = $(_0x8057[1091] + id + _0x8057[730])[_0x8057[770]](name);
                    if (active) {
                        $tab[_0x8057[347]](_0x8057[1092]);
                    };
                    var self = this;
                    $tab[_0x8057[425]](_0x8057[428], function(e) {
                        e[_0x8057[413]]();
                        $(_0x8057[1093])[_0x8057[397]]();
                        $(_0x8057[1094] + $(this)[_0x8057[276]](_0x8057[505]))[_0x8057[481]]();
                        self[_0x8057[50]][_0x8057[1089]][_0x8057[332]](_0x8057[118])[_0x8057[350]](_0x8057[1092]);
                        $(this)[_0x8057[347]](_0x8057[1092]);
                    });
                    this[_0x8057[50]][_0x8057[1089]][_0x8057[327]]($tab);
                },
                addTemplate: function(name, template) {
                    this[_0x8057[63]][_0x8057[50]][name] = template;
                },
                getTemplate: function(name) {
                    return this[_0x8057[63]][_0x8057[50]][name];
                },
                getModal: function() {
                    return this[_0x8057[1096]][_0x8057[332]](_0x8057[1095]);
                },
                load: function(templateName, title, width) {
                    this[_0x8057[50]][_0x8057[1097]] = templateName;
                    this[_0x8057[50]][_0x8057[738]] = width;
                    this[_0x8057[50]][_0x8057[31]]();
                    this[_0x8057[50]][_0x8057[1098]]();
                    this[_0x8057[50]][_0x8057[1099]](title);
                    this[_0x8057[50]][_0x8057[1100]]();
                    this[_0x8057[50]][_0x8057[1101]]();
                    if (typeof this[_0x8057[50]][_0x8057[1088]][templateName] != _0x8057[14]) {
                        this[_0x8057[50]][_0x8057[1088]][templateName][_0x8057[6]](this);
                    };
                },
                show: function() {
                    if (this[_0x8057[62]][_0x8057[734]]() && !this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                        document[_0x8057[735]][_0x8057[446]]();
                    };
                    $(document[_0x8057[87]])[_0x8057[350]](_0x8057[747]);
                    this[_0x8057[50]][_0x8057[1102]] = $(document[_0x8057[87]])[_0x8057[274]](_0x8057[1103]);
                    $(document[_0x8057[87]])[_0x8057[274]](_0x8057[1103], _0x8057[1104]);
                    if (this[_0x8057[62]][_0x8057[734]]()) {
                        this[_0x8057[50]][_0x8057[1105]]();
                    } else {
                        this[_0x8057[50]][_0x8057[1106]]();
                    };
                    this[_0x8057[723]][_0x8057[481]]();
                    this[_0x8057[722]][_0x8057[481]]();
                    this[_0x8057[50]][_0x8057[1107]]();
                    this[_0x8057[62]][_0x8057[1019]]();
                    if (!this[_0x8057[62]][_0x8057[734]]()) {
                        setTimeout($[_0x8057[281]](this[_0x8057[50]][_0x8057[1106]], this), 0);
                        $(window)[_0x8057[425]](_0x8057[1108], $[_0x8057[281]](this[_0x8057[50]][_0x8057[1109]], this));
                    };
                    this[_0x8057[36]][_0x8057[248]](_0x8057[1110], this[_0x8057[50]][_0x8057[1097]], this.$modal);
                    $(document)[_0x8057[708]](_0x8057[1111]);
                    this[_0x8057[1115]][_0x8057[332]](_0x8057[1114])[_0x8057[425]](_0x8057[1112], $[_0x8057[281]](this[_0x8057[50]][_0x8057[1113]], this));
                },
                showOnDesktop: function() {
                    var height = this[_0x8057[1115]][_0x8057[1116]]();
                    var windowHeight = $(window)[_0x8057[702]]();
                    var windowWidth = $(window)[_0x8057[738]]();
                    if (this[_0x8057[50]][_0x8057[738]] > windowWidth) {
                        this[_0x8057[1115]][_0x8057[274]]({
                            width: _0x8057[1117],
                            marginTop: (windowHeight / 2 - height / 2) + _0x8057[484]
                        });
                        return;
                    };
                    if (height > windowHeight) {
                        this[_0x8057[1115]][_0x8057[274]]({
                            width: this[_0x8057[50]][_0x8057[738]] + _0x8057[484],
                            marginTop: _0x8057[1118]
                        });
                    } else {
                        this[_0x8057[1115]][_0x8057[274]]({
                            width: this[_0x8057[50]][_0x8057[738]] + _0x8057[484],
                            marginTop: (windowHeight / 2 - height / 2) + _0x8057[484]
                        });
                    };
                },
                showOnMobile: function() {
                    this[_0x8057[1115]][_0x8057[274]]({
                        width: _0x8057[1117],
                        marginTop: _0x8057[1119]
                    });
                },
                resize: function() {
                    if (this[_0x8057[62]][_0x8057[734]]()) {
                        this[_0x8057[50]][_0x8057[1105]]();
                    } else {
                        this[_0x8057[50]][_0x8057[1106]]();
                    };
                },
                setTitle: function(title) {
                    this[_0x8057[1120]][_0x8057[68]](title);
                },
                setContent: function() {
                    this[_0x8057[1096]][_0x8057[68]](this[_0x8057[50]][_0x8057[1121]](this[_0x8057[50]][_0x8057[1097]]));
                },
                setDraggable: function() {
                    if (typeof $[_0x8057[5]][_0x8057[1122]] === _0x8057[14]) {
                        return;
                    };
                    this[_0x8057[1115]][_0x8057[1122]]({
                        handle: this[_0x8057[1120]]
                    });
                    this[_0x8057[1120]][_0x8057[274]](_0x8057[1123], _0x8057[1124]);
                },
                setEnter: function(e) {
                    if (e[_0x8057[944]] != 13) {
                        return;
                    };
                    e[_0x8057[413]]();
                    this[_0x8057[1115]][_0x8057[332]](_0x8057[1125])[_0x8057[428]]();
                },
                createCancelButton: function() {
                    var button = $(_0x8057[1128])[_0x8057[347]](_0x8057[1127])[_0x8057[68]](this[_0x8057[46]][_0x8057[292]](_0x8057[1126]));
                    button[_0x8057[425]](_0x8057[428], $[_0x8057[281]](this[_0x8057[50]][_0x8057[757]], this));
                    this[_0x8057[1129]][_0x8057[327]](button);
                },
                createDeleteButton: function(label) {
                    return this[_0x8057[50]][_0x8057[1131]](label, _0x8057[1130]);
                },
                createActionButton: function(label) {
                    return this[_0x8057[50]][_0x8057[1131]](label, _0x8057[1132]);
                },
                createButton: function(label, className) {
                    var button = $(_0x8057[1128])[_0x8057[347]](_0x8057[1135])[_0x8057[347]](_0x8057[1133] + className + _0x8057[1134])[_0x8057[68]](label);
                    this[_0x8057[1129]][_0x8057[327]](button);
                    return button;
                },
                setButtonsWidth: function() {
                    var buttons = this[_0x8057[1129]][_0x8057[332]](_0x8057[32]);
                    var buttonsSize = buttons[_0x8057[21]];
                    if (buttonsSize === 0) {
                        return;
                    };
                    buttons[_0x8057[274]](_0x8057[738], (100 / buttonsSize) + _0x8057[1136]);
                },
                build: function() {
                    this[_0x8057[50]][_0x8057[1137]]();
                    this[_0x8057[722]] = $(_0x8057[1138])[_0x8057[397]]();
                    this[_0x8057[1115]] = $(_0x8057[1139]);
                    this[_0x8057[1120]] = $(_0x8057[1140]);
                    this[_0x8057[1141]] = $(_0x8057[1143])[_0x8057[68]](_0x8057[1142]);
                    this[_0x8057[1096]] = $(_0x8057[1144]);
                    this[_0x8057[1129]] = $(_0x8057[1145]);
                    this[_0x8057[1115]][_0x8057[327]](this.$modalHeader);
                    this[_0x8057[1115]][_0x8057[327]](this.$modalClose);
                    this[_0x8057[1115]][_0x8057[327]](this.$modalBody);
                    this[_0x8057[1115]][_0x8057[327]](this.$modalFooter);
                    this[_0x8057[722]][_0x8057[327]](this.$modal);
                    this[_0x8057[722]][_0x8057[478]](document[_0x8057[87]]);
                },
                buildOverlay: function() {
                    this[_0x8057[723]] = $(_0x8057[1146])[_0x8057[397]]();
                    $(_0x8057[87])[_0x8057[328]](this.$modalOverlay);
                },
                enableEvents: function() {
                    this[_0x8057[1141]][_0x8057[425]](_0x8057[1147], $[_0x8057[281]](this[_0x8057[50]][_0x8057[757]], this));
                    $(document)[_0x8057[425]](_0x8057[1148], $[_0x8057[281]](this[_0x8057[50]][_0x8057[1149]], this));
                    this[_0x8057[261]][_0x8057[425]](_0x8057[1148], $[_0x8057[281]](this[_0x8057[50]][_0x8057[1149]], this));
                    this[_0x8057[722]][_0x8057[425]](_0x8057[1147], $[_0x8057[281]](this[_0x8057[50]][_0x8057[757]], this));
                },
                disableEvents: function() {
                    this[_0x8057[1141]][_0x8057[708]](_0x8057[1147]);
                    $(document)[_0x8057[708]](_0x8057[1148]);
                    this[_0x8057[261]][_0x8057[708]](_0x8057[1148]);
                    this[_0x8057[722]][_0x8057[708]](_0x8057[1147]);
                    $(window)[_0x8057[708]](_0x8057[1108]);
                },
                closeHandler: function(e) {
                    if (e[_0x8057[944]] != this[_0x8057[711]][_0x8057[982]]) {
                        return;
                    };
                    this[_0x8057[50]][_0x8057[757]](false);
                },
                close: function(e) {
                    if (e) {
                        if (!$(e[_0x8057[442]])[_0x8057[448]](_0x8057[1150]) && e[_0x8057[442]] != this[_0x8057[1141]][0] && e[_0x8057[442]] != this[_0x8057[722]][0]) {
                            return;
                        };
                        e[_0x8057[413]]();
                    };
                    if (!this[_0x8057[722]]) {
                        return;
                    };
                    this[_0x8057[50]][_0x8057[1151]]();
                    this[_0x8057[723]][_0x8057[331]]();
                    this[_0x8057[722]][_0x8057[1154]](_0x8057[1152], $[_0x8057[281]](function() {
                        this[_0x8057[722]][_0x8057[331]]();
                        setTimeout($[_0x8057[281]](this[_0x8057[62]][_0x8057[1021]], this), 0);
                        if (e !== undefined) {
                            this[_0x8057[56]][_0x8057[269]]();
                        };
                        $(document[_0x8057[87]])[_0x8057[274]](_0x8057[1103], this[_0x8057[50]][_0x8057[1102]]);
                        this[_0x8057[36]][_0x8057[248]](_0x8057[1153], this[_0x8057[50]][_0x8057[1097]]);
                    }, this));
                }
            };
        },
        observe: function() {
            return {
                load: function() {
                    this[_0x8057[51]][_0x8057[815]]();
                    this[_0x8057[51]][_0x8057[1050]]();
                },
                buttons: function(e, btnName) {
                    var current = this[_0x8057[56]][_0x8057[883]]();
                    var parent = this[_0x8057[56]][_0x8057[911]]();
                    this[_0x8057[32]][_0x8057[1155]](btnName);
                    if (e === false && btnName !== _0x8057[68]) {
                        if ($[_0x8057[306]](btnName, this[_0x8057[63]][_0x8057[1156]]) != -1) {
                            this[_0x8057[32]][_0x8057[1157]](btnName);
                        };
                        return;
                    };
                    $[_0x8057[20]](this[_0x8057[63]][_0x8057[1158]], $[_0x8057[281]](function(key, value) {
                        var parentEl = $(parent)[_0x8057[352]](key);
                        var currentEl = $(current)[_0x8057[352]](key);
                        if (parentEl[_0x8057[21]] !== 0 && !this[_0x8057[62]][_0x8057[774]](parentEl)) {
                            return;
                        };
                        if (!this[_0x8057[62]][_0x8057[774]](currentEl)) {
                            return;
                        };
                        if (parentEl[_0x8057[21]] !== 0 || currentEl[_0x8057[352]](key)[_0x8057[21]] !== 0) {
                            this[_0x8057[32]][_0x8057[707]](value);
                        };
                    }, this));
                    var $parent = $(parent)[_0x8057[352]](this[_0x8057[63]][_0x8057[236]].toString()[_0x8057[325]]());
                    if (this[_0x8057[62]][_0x8057[774]](parent) && $parent[_0x8057[21]]) {
                        var align = ($parent[_0x8057[274]](_0x8057[273]) === _0x8057[255]) ? _0x8057[485] : $parent[_0x8057[274]](_0x8057[273]);
                        this[_0x8057[32]][_0x8057[707]](_0x8057[1159] + align);
                    };
                },
                addButton: function(tag, btnName) {
                    this[_0x8057[63]][_0x8057[1156]][_0x8057[16]](btnName);
                    this[_0x8057[63]][_0x8057[1158]][tag] = btnName;
                },
                images: function() {
                    this[_0x8057[261]][_0x8057[332]](_0x8057[119])[_0x8057[20]]($[_0x8057[281]](function(i, img) {
                        var $img = $(img);
                        $img[_0x8057[352]](_0x8057[118])[_0x8057[425]](_0x8057[428], function(e) {
                            e[_0x8057[413]]();
                        });
                        if (this[_0x8057[62]][_0x8057[260]](_0x8057[259])) {
                            $img[_0x8057[276]](_0x8057[1160], _0x8057[425]);
                        };
                        this[_0x8057[40]][_0x8057[1161]]($img);
                    }, this));
                    $(document)[_0x8057[425]](_0x8057[1162], $[_0x8057[281]](function(e) {
                        this[_0x8057[51]][_0x8057[40]] = false;
                        if (e[_0x8057[442]][_0x8057[311]] == _0x8057[849] && this[_0x8057[62]][_0x8057[774]](e[_0x8057[442]])) {
                            this[_0x8057[51]][_0x8057[40]] = (this[_0x8057[51]][_0x8057[40]] && this[_0x8057[51]][_0x8057[40]] == e[_0x8057[442]]) ? false : e[_0x8057[442]];
                        };
                    }, this));
                },
                links: function() {
                    if (!this[_0x8057[63]][_0x8057[1163]]) {
                        return;
                    };
                    this[_0x8057[261]][_0x8057[332]](_0x8057[118])[_0x8057[425]](_0x8057[473], $[_0x8057[281]](this[_0x8057[51]][_0x8057[1164]], this));
                    this[_0x8057[261]][_0x8057[425]](_0x8057[1165], $[_0x8057[281]](this[_0x8057[51]][_0x8057[1166]], this));
                    $(document)[_0x8057[425]](_0x8057[1165], $[_0x8057[281]](this[_0x8057[51]][_0x8057[1166]], this));
                },
                getTooltipPosition: function($link) {
                    return $link[_0x8057[480]]();
                },
                showTooltip: function(e) {
                    var $link = $(e[_0x8057[442]]);
                    var $parent = $link[_0x8057[352]](_0x8057[118]);
                    var tag = ($link[_0x8057[21]] !== 0) ? $link[0][_0x8057[311]] : false;
                    if ($parent[0][_0x8057[311]] === _0x8057[589]) {
                        if (tag === _0x8057[849]) {
                            return;
                        } else {
                            if (tag !== _0x8057[589]) {
                                $link = $parent;
                            };
                        };
                    };
                    if (tag !== _0x8057[589]) {
                        return;
                    };
                    var pos = this[_0x8057[51]][_0x8057[1167]]($link);
                    var tooltip = $(_0x8057[1168]);
                    var href = $link[_0x8057[276]](_0x8057[791]);
                    if (href === undefined) {
                        href = _0x8057[255];
                    };
                    if (href[_0x8057[21]] > 24) {
                        href = href[_0x8057[713]](0, 24) + _0x8057[1169];
                    };
                    var aLink = $(_0x8057[760] + $link[_0x8057[276]](_0x8057[791]) + _0x8057[1171])[_0x8057[68]](href)[_0x8057[347]](_0x8057[1170]);
                    var aEdit = $(_0x8057[1172])[_0x8057[68]](this[_0x8057[46]][_0x8057[292]](_0x8057[779]))[_0x8057[425]](_0x8057[428], $[_0x8057[281]](this[_0x8057[48]][_0x8057[481]], this))[_0x8057[347]](_0x8057[1170]);
                    var aUnlink = $(_0x8057[1172])[_0x8057[68]](this[_0x8057[46]][_0x8057[292]](_0x8057[1173]))[_0x8057[425]](_0x8057[428], $[_0x8057[281]](this[_0x8057[48]][_0x8057[1173]], this))[_0x8057[347]](_0x8057[1170]);
                    tooltip[_0x8057[327]](aLink)[_0x8057[327]](_0x8057[1174])[_0x8057[327]](aEdit)[_0x8057[327]](_0x8057[1174])[_0x8057[327]](aUnlink);
                    tooltip[_0x8057[274]]({
                        top: (pos[_0x8057[482]] + parseInt($link[_0x8057[274]](_0x8057[1175]), 10)) + _0x8057[484],
                        left: pos[_0x8057[485]] + _0x8057[484]
                    });
                    $(_0x8057[1037])[_0x8057[331]]();
                    $(_0x8057[87])[_0x8057[327]](tooltip);
                },
                closeTooltip: function(e) {
                    e = e[_0x8057[421]] || e;
                    var target = e[_0x8057[442]];
                    var $parent = $(target)[_0x8057[352]](_0x8057[118]);
                    if ($parent[_0x8057[21]] !== 0 && $parent[0][_0x8057[311]] === _0x8057[589] && target[_0x8057[311]] !== _0x8057[589]) {
                        return;
                    } else {
                        if ((target[_0x8057[311]] === _0x8057[589] && this[_0x8057[62]][_0x8057[774]](target)) || $(target)[_0x8057[448]](_0x8057[1170])) {
                            return;
                        };
                    };
                    $(_0x8057[1037])[_0x8057[331]]();
                }
            };
        },
        paragraphize: function() {
            return {
                load: function(html) {
                    if (this[_0x8057[63]][_0x8057[282]]) {
                        return html;
                    };
                    if (html === _0x8057[255] || html === _0x8057[1176]) {
                        return this[_0x8057[63]][_0x8057[517]];
                    };
                    this[_0x8057[52]][_0x8057[263]] = [_0x8057[362], _0x8057[271], _0x8057[79], _0x8057[1177], _0x8057[126], _0x8057[127], _0x8057[80], _0x8057[81], _0x8057[82], _0x8057[83], _0x8057[84], _0x8057[85], _0x8057[342], _0x8057[78], _0x8057[950], _0x8057[623], _0x8057[1095], _0x8057[1178], _0x8057[1179], _0x8057[1180], _0x8057[1181], _0x8057[631], _0x8057[90], _0x8057[89], _0x8057[628], _0x8057[939], _0x8057[1182], _0x8057[1183], _0x8057[32], _0x8057[1184], _0x8057[1185], _0x8057[1186], _0x8057[1187], _0x8057[1020], _0x8057[1188], _0x8057[1189], _0x8057[1190], _0x8057[1191], _0x8057[866], _0x8057[1192], _0x8057[1193], _0x8057[1194], _0x8057[77]];
                    html = html + _0x8057[618];
                    this[_0x8057[52]][_0x8057[1195]] = [];
                    this[_0x8057[52]][_0x8057[1196]] = 0;
                    html = html[_0x8057[541]](/(<br\s?\/?>){1,}\n?<\/blockquote>/gi, _0x8057[687]);
                    html = this[_0x8057[52]][_0x8057[1197]](html);
                    html = this[_0x8057[52]][_0x8057[1198]](html);
                    html = this[_0x8057[52]][_0x8057[1199]](html);
                    html = this[_0x8057[52]][_0x8057[1200]](html);
                    html = this[_0x8057[52]][_0x8057[302]](html);
                    html = this[_0x8057[52]][_0x8057[1201]](html);
                    html = html[_0x8057[541]](new RegExp(_0x8057[1202] + this[_0x8057[52]][_0x8057[263]][_0x8057[241]](_0x8057[240]) + _0x8057[1203], _0x8057[563]), _0x8057[1204]);
                    return $[_0x8057[390]](html);
                },
                getSafes: function(html) {
                    var $div = $(_0x8057[394])[_0x8057[327]](html);
                    $div[_0x8057[332]](_0x8057[1205])[_0x8057[284]](function() {
                        return $(this)[_0x8057[327]](_0x8057[359])[_0x8057[336]]();
                    });
                    html = $div[_0x8057[68]]();
                    $div[_0x8057[332]](this[_0x8057[52]][_0x8057[263]][_0x8057[241]](_0x8057[668]))[_0x8057[20]]($[_0x8057[281]](function(i, s) {
                        this[_0x8057[52]][_0x8057[1196]] ++;
                        this[_0x8057[52]][_0x8057[1195]][this[_0x8057[52]][_0x8057[1196]]] = s[_0x8057[1206]];
                        html = html[_0x8057[541]](s[_0x8057[1206]], _0x8057[1207] + this[_0x8057[52]][_0x8057[1196]] + _0x8057[1208]);
                    }, this));
                    return html;
                },
                getSafesComments: function(html) {
                    var commentsMatches = html[_0x8057[647]](/<!--([\w\W]*?)-->/gi);
                    if (!commentsMatches) {
                        return html;
                    };
                    $[_0x8057[20]](commentsMatches, $[_0x8057[281]](function(i, s) {
                        this[_0x8057[52]][_0x8057[1196]] ++;
                        this[_0x8057[52]][_0x8057[1195]][this[_0x8057[52]][_0x8057[1196]]] = s;
                        html = html[_0x8057[541]](s, _0x8057[1207] + this[_0x8057[52]][_0x8057[1196]] + _0x8057[1208]);
                    }, this));
                    return html;
                },
                restoreSafes: function(html) {
                    $[_0x8057[20]](this[_0x8057[52]][_0x8057[1195]], function(i, s) {
                        html = html[_0x8057[541]](_0x8057[1209] + i + _0x8057[1208], s);
                    });
                    return html;
                },
                replaceBreaksToParagraphs: function(html) {
                    var htmls = html[_0x8057[13]](new RegExp(_0x8057[618], _0x8057[561]), -1);
                    html = _0x8057[255];
                    if (htmls) {
                        var len = htmls[_0x8057[21]];
                        for (var i = 0; i < len; i++) {
                            if (!htmls[_0x8057[1210]](i)) {
                                return;
                            };
                            if (htmls[i][_0x8057[10]](_0x8057[1209]) == -1) {
                                htmls[i] = htmls[i][_0x8057[541]](/<p>\n\t?<\/p>/gi, _0x8057[255]);
                                htmls[i] = htmls[i][_0x8057[541]](/<p><\/p>/gi, _0x8057[255]);
                                if (htmls[i] !== _0x8057[255]) {
                                    html += _0x8057[619] + htmls[i][_0x8057[541]](/^\n+|\n+$/g, _0x8057[255]) + _0x8057[620];
                                };
                            } else {
                                html += htmls[i];
                            };
                        };
                    };
                    return html;
                },
                replaceBreaksToNewLines: function(html) {
                    html = html[_0x8057[541]](/<br \/>\s*<br \/>/gi, _0x8057[1211]);
                    html = html[_0x8057[541]](/<br\s?\/?>\n?<br\s?\/?>/gi, _0x8057[1212]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[1213], _0x8057[561]), _0x8057[618]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[1214], _0x8057[561]), _0x8057[618]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[1215]), _0x8057[561], _0x8057[1211]);
                    return html;
                },
                clear: function(html) {
                    html = html[_0x8057[541]](new RegExp(_0x8057[1216], _0x8057[563]), _0x8057[687]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[1217], _0x8057[563]), _0x8057[687]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[1218], _0x8057[563]), _0x8057[1219]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[1220], _0x8057[563]), _0x8057[1219]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[1221], _0x8057[563]), _0x8057[1222]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[1223], _0x8057[563]), _0x8057[619]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[1224], _0x8057[563]), _0x8057[620]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[1225], _0x8057[563]), _0x8057[255]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[1226], _0x8057[563]), _0x8057[620]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[1227], _0x8057[563]), _0x8057[619]);
                    html = html[_0x8057[541]](new RegExp(_0x8057[1228], _0x8057[563]), _0x8057[255]);
                    return html;
                }
            };
        },
        paste: function() {
            return {
                init: function(e) {
                    if (!this[_0x8057[63]][_0x8057[1229]]) {
                        return;
                    };
                    this[_0x8057[231]] = true;
                    this[_0x8057[30]][_0x8057[256]]();
                    this[_0x8057[56]][_0x8057[262]]();
                    this[_0x8057[62]][_0x8057[1019]]();
                    this[_0x8057[53]][_0x8057[1230]]();
                    $(window)[_0x8057[425]](_0x8057[1231], $[_0x8057[281]](function() {
                        $(window)[_0x8057[699]](this[_0x8057[1232]]);
                    }, this));
                    setTimeout($[_0x8057[281]](function() {
                        var html = this[_0x8057[232]][_0x8057[68]]();
                        this[_0x8057[232]][_0x8057[331]]();
                        this[_0x8057[56]][_0x8057[269]]();
                        this[_0x8057[62]][_0x8057[1021]]();
                        this[_0x8057[53]][_0x8057[43]](html);
                        $(window)[_0x8057[708]](_0x8057[1231]);
                    }, this), 1);
                },
                createPasteBox: function() {
                    this[_0x8057[232]] = $(_0x8057[548])[_0x8057[68]](_0x8057[255])[_0x8057[276]](_0x8057[721], _0x8057[869])[_0x8057[274]]({
                        position: _0x8057[742],
                        width: 0,
                        top: 0,
                        left: _0x8057[1233]
                    });
                    this[_0x8057[381]][_0x8057[509]]()[_0x8057[327]](this.$pasteBox);
                    this[_0x8057[232]][_0x8057[39]]();
                },
                insert: function(html) {
                    html = this[_0x8057[36]][_0x8057[248]](_0x8057[1234], html);
                    html = (this[_0x8057[62]][_0x8057[588]]()) ? this[_0x8057[34]][_0x8057[914]](html, false) : this[_0x8057[34]][_0x8057[914]](html);
                    html = this[_0x8057[36]][_0x8057[248]](_0x8057[53], html);
                    if (this[_0x8057[62]][_0x8057[588]]()) {
                        this[_0x8057[43]][_0x8057[256]](html, false);
                    } else {
                        this[_0x8057[43]][_0x8057[68]](html, false);
                    };
                    this[_0x8057[62]][_0x8057[431]]();
                    this[_0x8057[231]] = false;
                    setTimeout($[_0x8057[281]](this[_0x8057[34]][_0x8057[353]], this), 10);
                    setTimeout($[_0x8057[281]](function() {
                        var spans = this[_0x8057[261]][_0x8057[332]](_0x8057[101]);
                        $[_0x8057[20]](spans, function(i, s) {
                            var html = s[_0x8057[514]][_0x8057[541]](/[\u200B-\u200D\uFEFF]/, _0x8057[255]);
                            if (html === _0x8057[255] && s[_0x8057[910]][_0x8057[21]] === 0) {
                                $(s)[_0x8057[331]]();
                            };
                        });
                    }, this), 10);
                }
            };
        },
        placeholder: function() {
            return {
                enable: function() {
                    if (!this[_0x8057[54]][_0x8057[450]]()) {
                        return;
                    };
                    this[_0x8057[261]][_0x8057[276]](_0x8057[54], this[_0x8057[229]][_0x8057[276]](_0x8057[54]));
                    this[_0x8057[54]][_0x8057[324]]();
                    this[_0x8057[261]][_0x8057[425]](_0x8057[1235], $[_0x8057[281]](this[_0x8057[54]][_0x8057[324]], this));
                },
                toggle: function() {
                    var func = _0x8057[350];
                    if (this[_0x8057[62]][_0x8057[293]](this[_0x8057[261]][_0x8057[68]](), false)) {
                        func = _0x8057[347];
                    };
                    this[_0x8057[261]][func](_0x8057[1236]);
                },
                remove: function() {
                    this[_0x8057[261]][_0x8057[350]](_0x8057[1236]);
                },
                is: function() {
                    if (this[_0x8057[63]][_0x8057[54]]) {
                        return this[_0x8057[229]][_0x8057[276]](_0x8057[54], this[_0x8057[63]][_0x8057[54]]);
                    } else {
                        return !(typeof this[_0x8057[229]][_0x8057[276]](_0x8057[54]) == _0x8057[14] || this[_0x8057[229]][_0x8057[276]](_0x8057[54]) === _0x8057[255]);
                    };
                }
            };
        },
        progress: function() {
            return {
                show: function() {
                    $(document[_0x8057[87]])[_0x8057[327]]($(_0x8057[1237]));
                    $(_0x8057[1239])[_0x8057[1238]]();
                },
                hide: function() {
                    $(_0x8057[1239])[_0x8057[1154]](1500, function() {
                        $(this)[_0x8057[331]]();
                    });
                }
            };
        },
        selection: function() {
            return {
                get: function() {
                    this[_0x8057[755]] = document[_0x8057[531]]();
                    if (document[_0x8057[531]] && this[_0x8057[755]][_0x8057[533]] && this[_0x8057[755]][_0x8057[532]]) {
                        this[_0x8057[313]] = this[_0x8057[755]][_0x8057[533]](0);
                    } else {
                        this[_0x8057[313]] = document[_0x8057[930]]();
                    };
                },
                addRange: function() {
                    try {
                        this[_0x8057[755]][_0x8057[921]]();
                    } catch (e) {};
                    this[_0x8057[755]][_0x8057[518]](this[_0x8057[313]]);
                },
                getCurrent: function() {
                    var el = false;
                    this[_0x8057[56]][_0x8057[292]]();
                    if (this[_0x8057[755]] && this[_0x8057[755]][_0x8057[532]] > 0) {
                        el = this[_0x8057[755]][_0x8057[533]](0)[_0x8057[1240]];
                    };
                    return this[_0x8057[62]][_0x8057[774]](el);
                },
                getParent: function(elem) {
                    elem = elem || this[_0x8057[56]][_0x8057[883]]();
                    if (elem) {
                        return this[_0x8057[62]][_0x8057[774]]($(elem)[_0x8057[509]]()[0]);
                    };
                    return false;
                },
                getBlock: function(node) {
                    node = node || this[_0x8057[56]][_0x8057[883]]();
                    while (node) {
                        if (this[_0x8057[62]][_0x8057[513]](node[_0x8057[311]])) {
                            return ($(node)[_0x8057[448]](_0x8057[396])) ? false : node;
                        };
                        node = node[_0x8057[773]];
                    };
                    return false;
                },
                getInlines: function(nodes) {
                    this[_0x8057[56]][_0x8057[292]]();
                    if (this[_0x8057[313]] && this[_0x8057[313]][_0x8057[314]]) {
                        return false;
                    };
                    var inlines = [];
                    nodes = (typeof nodes == _0x8057[14]) ? this[_0x8057[56]][_0x8057[913]]() : nodes;
                    var inlineTags = this[_0x8057[63]][_0x8057[678]];
                    inlineTags[_0x8057[16]](_0x8057[101]);
                    $[_0x8057[20]](nodes, $[_0x8057[281]](function(i, node) {
                        if ($[_0x8057[306]](node[_0x8057[311]][_0x8057[325]](), inlineTags) != -1) {
                            inlines[_0x8057[16]](node);
                        };
                    }, this));
                    return (inlines[_0x8057[21]] === 0) ? false : inlines;
                },
                getBlocks: function(nodes) {
                    this[_0x8057[56]][_0x8057[292]]();
                    if (this[_0x8057[313]] && this[_0x8057[313]][_0x8057[314]]) {
                        return [this[_0x8057[56]][_0x8057[323]]()];
                    };
                    var blocks = [];
                    nodes = (typeof nodes == _0x8057[14]) ? this[_0x8057[56]][_0x8057[913]]() : nodes;
                    $[_0x8057[20]](nodes, $[_0x8057[281]](function(i, node) {
                        if (this[_0x8057[62]][_0x8057[511]](node)) {
                            this[_0x8057[56]][_0x8057[1241]] = node;
                            blocks[_0x8057[16]](node);
                        };
                    }, this));
                    return (blocks[_0x8057[21]] === 0) ? [this[_0x8057[56]][_0x8057[323]]()] : blocks;
                },
                getLastBlock: function() {
                    return this[_0x8057[56]][_0x8057[1241]];
                },
                getNodes: function() {
                    this[_0x8057[56]][_0x8057[292]]();
                    var startNode = this[_0x8057[56]][_0x8057[1242]](1);
                    var endNode = this[_0x8057[56]][_0x8057[1242]](2);
                    var range = this[_0x8057[313]][_0x8057[527]]();
                    if (this[_0x8057[313]][_0x8057[314]] === false) {
                        var startContainer = range[_0x8057[1240]];
                        var startOffset = range[_0x8057[1243]];
                        this[_0x8057[56]][_0x8057[1244]](range, endNode, false);
                        range[_0x8057[454]](startContainer, startOffset);
                        this[_0x8057[56]][_0x8057[1244]](range, startNode, true);
                    } else {
                        this[_0x8057[56]][_0x8057[1244]](range, startNode, true);
                        endNode = startNode;
                    };
                    var nodes = [];
                    var counter = 0;
                    var self = this;
                    this[_0x8057[261]][_0x8057[332]](_0x8057[635])[_0x8057[20]](function() {
                        if (this == startNode) {
                            var parent = $(this)[_0x8057[509]]();
                            if (parent[_0x8057[21]] !== 0 && parent[0][_0x8057[311]] != _0x8057[1000] && self[_0x8057[62]][_0x8057[774]](parent[0])) {
                                nodes[_0x8057[16]](parent[0]);
                            };
                            nodes[_0x8057[16]](this);
                            counter = 1;
                        } else {
                            if (counter > 0) {
                                nodes[_0x8057[16]](this);
                                counter = counter + 1;
                            };
                        };
                        if (this == endNode) {
                            return false;
                        };
                    });
                    var finalNodes = [];
                    var len = nodes[_0x8057[21]];
                    for (var i = 0; i < len; i++) {
                        if (nodes[i][_0x8057[386]] != _0x8057[1245] && nodes[i][_0x8057[386]] != _0x8057[1246]) {
                            finalNodes[_0x8057[16]](nodes[i]);
                        };
                    };
                    this[_0x8057[56]][_0x8057[1247]]();
                    return finalNodes;
                },
                getNodesMarker: function(num) {
                    return $(_0x8057[1248] + num + _0x8057[1249] + this[_0x8057[63]][_0x8057[515]] + _0x8057[862])[0];
                },
                setNodesMarker: function(range, node, type) {
                    try {
                        range[_0x8057[526]](type);
                        range[_0x8057[920]](node);
                    } catch (e) {};
                },
                removeNodesMarkers: function() {
                    $(document)[_0x8057[332]](_0x8057[1250])[_0x8057[331]]();
                    this[_0x8057[261]][_0x8057[332]](_0x8057[1250])[_0x8057[331]]();
                },
                fromPoint: function(start, end) {
                    this[_0x8057[33]][_0x8057[538]](start, end);
                },
                wrap: function(tag) {
                    this[_0x8057[56]][_0x8057[292]]();
                    if (this[_0x8057[313]][_0x8057[314]]) {
                        return false;
                    };
                    var wrapper = document[_0x8057[652]](tag);
                    wrapper[_0x8057[918]](this[_0x8057[313]][_0x8057[1251]]());
                    this[_0x8057[313]][_0x8057[920]](wrapper);
                    return wrapper;
                },
                selectElement: function(node) {
                    this[_0x8057[33]][_0x8057[256]](node, 0, node, 1);
                },
                selectAll: function() {
                    this[_0x8057[56]][_0x8057[292]]();
                    this[_0x8057[313]][_0x8057[528]](this[_0x8057[261]][0]);
                    this[_0x8057[56]][_0x8057[518]]();
                },
                remove: function() {
                    this[_0x8057[56]][_0x8057[292]]();
                    this[_0x8057[755]][_0x8057[921]]();
                },
                save: function() {
                    this[_0x8057[56]][_0x8057[1252]]();
                },
                createMarkers: function() {
                    this[_0x8057[56]][_0x8057[292]]();
                    var node1 = this[_0x8057[56]][_0x8057[360]](1);
                    this[_0x8057[56]][_0x8057[1253]](this[_0x8057[313]], node1, true);
                    if (this[_0x8057[313]][_0x8057[314]] === false) {
                        var node2 = this[_0x8057[56]][_0x8057[360]](2);
                        this[_0x8057[56]][_0x8057[1253]](this[_0x8057[313]], node2, false);
                    };
                    this[_0x8057[1254]] = this[_0x8057[261]][_0x8057[68]]();
                },
                getMarker: function(num) {
                    if (typeof num == _0x8057[14]) {
                        num = 1;
                    };
                    return $(_0x8057[1255] + num + _0x8057[1256] + this[_0x8057[63]][_0x8057[515]] + _0x8057[862])[0];
                },
                getMarkerAsHtml: function(num) {
                    return this[_0x8057[62]][_0x8057[814]](this[_0x8057[56]][_0x8057[360]](num));
                },
                setMarker: function(range, node, type) {
                    range = range[_0x8057[527]]();
                    try {
                        range[_0x8057[526]](type);
                        range[_0x8057[920]](node);
                    } catch (e) {
                        this[_0x8057[39]][_0x8057[454]]();
                    };
                },
                restore: function() {
                    var node1 = this[_0x8057[261]][_0x8057[332]](_0x8057[1257]);
                    var node2 = this[_0x8057[261]][_0x8057[332]](_0x8057[1258]);
                    if (node1[_0x8057[21]] !== 0 && node2[_0x8057[21]] !== 0) {
                        this[_0x8057[33]][_0x8057[256]](node1, 0, node2, 0);
                    } else {
                        if (node1[_0x8057[21]] !== 0) {
                            this[_0x8057[33]][_0x8057[256]](node1, 0, node1, 0);
                        } else {
                            this[_0x8057[261]][_0x8057[39]]();
                        };
                    };
                    this[_0x8057[56]][_0x8057[763]]();
                    this[_0x8057[1254]] = false;
                },
                removeMarkers: function() {
                    this[_0x8057[261]][_0x8057[332]](_0x8057[1259])[_0x8057[331]]();
                },
                getText: function() {
                    this[_0x8057[56]][_0x8057[292]]();
                    return this[_0x8057[755]].toString();
                },
                getHtml: function() {
                    var html = _0x8057[255];
                    this[_0x8057[56]][_0x8057[292]]();
                    if (this[_0x8057[755]][_0x8057[532]]) {
                        var container = document[_0x8057[652]](_0x8057[271]);
                        var len = this[_0x8057[755]][_0x8057[532]];
                        for (var i = 0; i < len; ++i) {
                            container[_0x8057[918]](this[_0x8057[755]][_0x8057[533]](i)[_0x8057[1260]]());
                        };
                        html = container[_0x8057[514]];
                    };
                    return this[_0x8057[34]][_0x8057[695]](html);
                }
            };
        },
        shortcuts: function() {
            return {
                init: function(e, key) {
                    if (!this[_0x8057[63]][_0x8057[57]]) {
                        if ((e[_0x8057[946]] || e[_0x8057[947]]) && (key === 66 || key === 73)) {
                            e[_0x8057[413]]();
                        };
                        return false;
                    };
                    $[_0x8057[20]](this[_0x8057[63]][_0x8057[57]], $[_0x8057[281]](function(str, command) {
                        var keys = str[_0x8057[13]](_0x8057[357]);
                        var len = keys[_0x8057[21]];
                        for (var i = 0; i < len; i++) {
                            if (typeof keys[i] === _0x8057[8]) {
                                this[_0x8057[57]][_0x8057[1262]](e, $[_0x8057[390]](keys[i]), $[_0x8057[281]](function() {
                                    var func;
                                    if (command[_0x8057[465]][_0x8057[10]](/\./) != _0x8057[11]) {
                                        func = command[_0x8057[465]][_0x8057[13]](_0x8057[12]);
                                        if (typeof this[func[0]] != _0x8057[14]) {
                                            this[func[0]][func[1]][_0x8057[3]](this, command[_0x8057[1261]]);
                                        };
                                    } else {
                                        this[command[_0x8057[465]]][_0x8057[3]](this, command[_0x8057[1261]]);
                                    };
                                }, this));
                            };
                        };
                    }, this));
                },
                handler: function(e, keys, origHandler) {
                    var hotkeysSpecialKeys = {
                        8: _0x8057[1263],
                        9: _0x8057[1264],
                        10: _0x8057[1265],
                        13: _0x8057[1265],
                        16: _0x8057[1266],
                        17: _0x8057[945],
                        18: _0x8057[637],
                        19: _0x8057[1267],
                        20: _0x8057[1268],
                        27: _0x8057[1269],
                        32: _0x8057[1270],
                        33: _0x8057[1271],
                        34: _0x8057[1272],
                        35: _0x8057[1273],
                        36: _0x8057[1274],
                        37: _0x8057[485],
                        38: _0x8057[1275],
                        39: _0x8057[257],
                        40: _0x8057[1276],
                        45: _0x8057[43],
                        46: _0x8057[93],
                        59: _0x8057[898],
                        61: _0x8057[1277],
                        96: _0x8057[1278],
                        97: _0x8057[1279],
                        98: _0x8057[1280],
                        99: _0x8057[1281],
                        100: _0x8057[1282],
                        101: _0x8057[1283],
                        102: _0x8057[1284],
                        103: _0x8057[1285],
                        104: _0x8057[1286],
                        105: _0x8057[1287],
                        106: _0x8057[635],
                        107: _0x8057[1288],
                        109: _0x8057[726],
                        110: _0x8057[12],
                        111: _0x8057[1289],
                        112: _0x8057[1290],
                        113: _0x8057[1291],
                        114: _0x8057[1292],
                        115: _0x8057[1293],
                        116: _0x8057[1294],
                        117: _0x8057[1295],
                        118: _0x8057[1296],
                        119: _0x8057[1297],
                        120: _0x8057[1298],
                        121: _0x8057[1299],
                        122: _0x8057[1300],
                        123: _0x8057[1301],
                        144: _0x8057[1302],
                        145: _0x8057[1303],
                        173: _0x8057[726],
                        186: _0x8057[898],
                        187: _0x8057[1277],
                        188: _0x8057[357],
                        189: _0x8057[726],
                        190: _0x8057[12],
                        191: _0x8057[1289],
                        192: _0x8057[1304],
                        219: _0x8057[1305],
                        220: _0x8057[1306],
                        221: _0x8057[891],
                        222: _0x8057[544]
                    };
                    var hotkeysShiftNums = {
                        "\x60": _0x8057[1307],
                        "\x31": _0x8057[1308],
                        "\x32": _0x8057[1044],
                        "\x33": _0x8057[1039],
                        "\x34": _0x8057[1309],
                        "\x35": _0x8057[1136],
                        "\x36": _0x8057[811],
                        "\x37": _0x8057[661],
                        "\x38": _0x8057[635],
                        "\x39": _0x8057[1310],
                        "\x30": _0x8057[1311],
                        "\x2D": _0x8057[1312],
                        "\x3D": _0x8057[1288],
                        "\x3B": _0x8057[1313],
                        "\x27": _0x8057[543],
                        "\x2C": _0x8057[320],
                        "\x2E": _0x8057[321],
                        "\x2F": _0x8057[1314],
                        "\x5C": _0x8057[240]
                    };
                    keys = keys[_0x8057[325]]()[_0x8057[13]](_0x8057[553]);
                    var special = hotkeysSpecialKeys[e[_0x8057[711]]],
                        character = String[_0x8057[1315]](e[_0x8057[944]])[_0x8057[325]](),
                        modif = _0x8057[255],
                        possible = {};
                    $[_0x8057[20]]([_0x8057[637], _0x8057[945], _0x8057[88], _0x8057[1266]], function(index, specialKey) {
                        if (e[specialKey + _0x8057[1316]] && special !== specialKey) {
                            modif += specialKey + _0x8057[1288];
                        };
                    });
                    if (special) {
                        possible[modif + special] = true;
                    };
                    if (character) {
                        possible[modif + character] = true;
                        possible[modif + hotkeysShiftNums[character]] = true;
                        if (modif === _0x8057[1317]) {
                            possible[hotkeysShiftNums[character]] = true;
                        };
                    };
                    for (var i = 0, len = keys[_0x8057[21]]; i < len; i++) {
                        if (possible[keys[i]]) {
                            e[_0x8057[413]]();
                            return origHandler[_0x8057[3]](this, arguments);
                        };
                    };
                }
            };
        },
        tabifier: function() {
            return {
                get: function(code) {
                    if (!this[_0x8057[63]][_0x8057[58]]) {
                        return code;
                    };
                    var ownLine = [_0x8057[1186], _0x8057[87], _0x8057[86], _0x8057[1020], _0x8057[1318], _0x8057[48], _0x8057[88], _0x8057[1319], _0x8057[90], _0x8057[89], _0x8057[362], _0x8057[632], _0x8057[634], _0x8057[633]];
                    var contOwnLine = [_0x8057[128], _0x8057[343], _0x8057[343], _0x8057[1320], _0x8057[1184], _0x8057[89]];
                    var newLevel = [_0x8057[78], _0x8057[271], _0x8057[342], _0x8057[1188], _0x8057[1177], _0x8057[1321], _0x8057[1185], _0x8057[127], _0x8057[77], _0x8057[79], _0x8057[939], _0x8057[340], _0x8057[341], _0x8057[363], _0x8057[126]];
                    this[_0x8057[58]][_0x8057[1322]] = new RegExp(_0x8057[1323] + ownLine[_0x8057[241]](_0x8057[1324]) + _0x8057[240] + contOwnLine[_0x8057[241]](_0x8057[240]) + _0x8057[1325]);
                    this[_0x8057[58]][_0x8057[1326]] = new RegExp(_0x8057[1327] + ownLine[_0x8057[241]](_0x8057[1324]) + _0x8057[1328] + contOwnLine[_0x8057[241]](_0x8057[1328]) + _0x8057[1325]);
                    this[_0x8057[58]][_0x8057[1329]] = new RegExp(_0x8057[1330] + newLevel[_0x8057[241]](_0x8057[240]) + _0x8057[1325]);
                    var i = 0,
                        codeLength = code[_0x8057[21]],
                        point = 0,
                        start = null,
                        end = null,
                        tag = _0x8057[255],
                        out = _0x8057[255],
                        cont = _0x8057[255];
                    this[_0x8057[58]][_0x8057[1331]] = 0;
                    for (; i < codeLength; i++) {
                        point = i;
                        if (-1 == code[_0x8057[1332]](i)[_0x8057[648]](_0x8057[320])) {
                            out += code[_0x8057[1332]](i);
                            return this[_0x8057[58]][_0x8057[1333]](out);
                        };
                        while (point < codeLength && code[_0x8057[1334]](point) != _0x8057[320]) {
                            point++;
                        };
                        if (i != point) {
                            cont = code[_0x8057[1332]](i, point - i);
                            if (!cont[_0x8057[647]](/^\s{2,}$/g)) {
                                if (_0x8057[618] == out[_0x8057[1334]](out[_0x8057[21]] - 1)) {
                                    out += this[_0x8057[58]][_0x8057[1335]]();
                                } else {
                                    if (_0x8057[618] == cont[_0x8057[1334]](0)) {
                                        out += _0x8057[618] + this[_0x8057[58]][_0x8057[1335]]();
                                        cont = cont[_0x8057[541]](/^\s+/, _0x8057[255]);
                                    };
                                };
                                out += cont;
                            };
                            if (cont[_0x8057[647]](/\n/)) {
                                out += _0x8057[618] + this[_0x8057[58]][_0x8057[1335]]();
                            };
                        };
                        start = point;
                        while (point < codeLength && _0x8057[321] != code[_0x8057[1334]](point)) {
                            point++;
                        };
                        tag = code[_0x8057[1332]](start, point - start);
                        i = point;
                        var t;
                        if (_0x8057[1336] == tag[_0x8057[1332]](1, 3)) {
                            if (!tag[_0x8057[647]](/--$/)) {
                                while (_0x8057[1337] != code[_0x8057[1332]](point, 3)) {
                                    point++;
                                };
                                point += 2;
                                tag = code[_0x8057[1332]](start, point - start);
                                i = point;
                            };
                            if (_0x8057[618] != out[_0x8057[1334]](out[_0x8057[21]] - 1)) {
                                out += _0x8057[618];
                            };
                            out += this[_0x8057[58]][_0x8057[1335]]();
                            out += tag + _0x8057[1338];
                        } else {
                            if (_0x8057[1308] == tag[1]) {
                                out = this[_0x8057[58]][_0x8057[1339]](tag + _0x8057[321], out);
                            } else {
                                if (_0x8057[1314] == tag[1]) {
                                    out += tag + _0x8057[1338];
                                } else {
                                    if (t = tag[_0x8057[647]](/^<(script|style|pre)/i)) {
                                        t[1] = t[1][_0x8057[325]]();
                                        tag = this[_0x8057[58]][_0x8057[1340]](tag);
                                        out = this[_0x8057[58]][_0x8057[1339]](tag, out);
                                        end = String(code[_0x8057[1332]](i + 1))[_0x8057[325]]()[_0x8057[648]](_0x8057[651] + t[1]);
                                        if (end) {
                                            cont = code[_0x8057[1332]](i + 1, end);
                                            i += end;
                                            out += cont;
                                        };
                                    } else {
                                        tag = this[_0x8057[58]][_0x8057[1340]](tag);
                                        out = this[_0x8057[58]][_0x8057[1339]](tag, out);
                                    };
                                };
                            };
                        };
                    };
                    return this[_0x8057[58]][_0x8057[1333]](out);
                },
                getTabs: function() {
                    var s = _0x8057[255];
                    for (var j = 0; j < this[_0x8057[58]][_0x8057[1331]]; j++) {
                        s += _0x8057[585];
                    };
                    return s;
                },
                finish: function(code) {
                    code = code[_0x8057[541]](/\n\s*\n/g, _0x8057[618]);
                    code = code[_0x8057[541]](/^[\s\n]*/, _0x8057[255]);
                    code = code[_0x8057[541]](/[\s\n]*$/, _0x8057[255]);
                    code = code[_0x8057[541]](/<script(.*?)>\n<\/script>/gi, _0x8057[1341]);
                    this[_0x8057[58]][_0x8057[1331]] = 0;
                    return code;
                },
                cleanTag: function(tag) {
                    var tagout = _0x8057[255];
                    tag = tag[_0x8057[541]](/\n/g, _0x8057[553]);
                    tag = tag[_0x8057[541]](/\s{2,}/g, _0x8057[553]);
                    tag = tag[_0x8057[541]](/^\s+|\s+$/g, _0x8057[553]);
                    var suffix = _0x8057[255];
                    if (tag[_0x8057[647]](/\/$/)) {
                        suffix = _0x8057[1289];
                        tag = tag[_0x8057[541]](/\/+$/, _0x8057[255]);
                    };
                    var m;
                    while (m = /\s*([^= ]+)(?:=((['"']).*?\3|[^ ]+))?/ [_0x8057[1342]](tag)) {
                        if (m[2]) {
                            tagout += m[1][_0x8057[325]]() + _0x8057[1277] + m[2];
                        } else {
                            if (m[1]) {
                                tagout += m[1][_0x8057[325]]();
                            };
                        };
                        tagout += _0x8057[553];
                        tag = tag[_0x8057[1332]](m[0][_0x8057[21]]);
                    };
                    return tagout[_0x8057[541]](/\s*$/, _0x8057[255]) + suffix + _0x8057[321];
                },
                placeTag: function(tag, out) {
                    var nl = tag[_0x8057[647]](this[_0x8057[58]][_0x8057[1329]]);
                    if (tag[_0x8057[647]](this[_0x8057[58]][_0x8057[1322]]) || nl) {
                        out = out[_0x8057[541]](/\s*$/, _0x8057[255]);
                        out += _0x8057[618];
                    };
                    if (nl && _0x8057[1289] == tag[_0x8057[1334]](1)) {
                        this[_0x8057[58]][_0x8057[1331]] --;
                    };
                    if (_0x8057[618] == out[_0x8057[1334]](out[_0x8057[21]] - 1)) {
                        out += this[_0x8057[58]][_0x8057[1335]]();
                    };
                    if (nl && _0x8057[1289] != tag[_0x8057[1334]](1)) {
                        this[_0x8057[58]][_0x8057[1331]] ++;
                    };
                    out += tag;
                    if (tag[_0x8057[647]](this[_0x8057[58]][_0x8057[1326]]) || tag[_0x8057[647]](this[_0x8057[58]][_0x8057[1329]])) {
                        out = out[_0x8057[541]](/ *$/, _0x8057[255]);
                        out += _0x8057[618];
                    };
                    return out;
                }
            };
        },
        tidy: function() {
            return {
                setupAllowed: function() {
                    if (this[_0x8057[63]][_0x8057[1343]]) {
                        this[_0x8057[63]][_0x8057[642]] = false;
                    };
                    if (this[_0x8057[63]][_0x8057[1344]]) {
                        this[_0x8057[63]][_0x8057[346]] = false;
                    };
                    if (this[_0x8057[63]][_0x8057[282]]) {
                        return;
                    };
                    var tags = [_0x8057[77], _0x8057[1095]];
                    if (this[_0x8057[63]][_0x8057[1343]]) {
                        this[_0x8057[59]][_0x8057[1345]](tags);
                    };
                    if (this[_0x8057[63]][_0x8057[642]]) {
                        this[_0x8057[59]][_0x8057[1346]](tags);
                    };
                },
                addToAllowed: function(tags) {
                    var len = tags[_0x8057[21]];
                    for (var i = 0; i < len; i++) {
                        if ($[_0x8057[306]](tags[i], this[_0x8057[63]][_0x8057[1343]]) == -1) {
                            this[_0x8057[63]][_0x8057[1343]][_0x8057[16]](tags[i]);
                        };
                    };
                },
                removeFromDenied: function(tags) {
                    var len = tags[_0x8057[21]];
                    for (var i = 0; i < len; i++) {
                        var pos = $[_0x8057[306]](tags[i], this[_0x8057[63]][_0x8057[642]]);
                        if (pos != -1) {
                            this[_0x8057[63]][_0x8057[642]][_0x8057[1347]](pos, 1);
                        };
                    };
                },
                load: function(html, options) {
                    this[_0x8057[59]][_0x8057[1348]] = {
                        deniedTags: this[_0x8057[63]][_0x8057[642]],
                        allowedTags: this[_0x8057[63]][_0x8057[1343]],
                        removeComments: this[_0x8057[63]][_0x8057[1349]],
                        replaceTags: this[_0x8057[63]][_0x8057[1350]],
                        replaceStyles: this[_0x8057[63]][_0x8057[1351]],
                        removeDataAttr: this[_0x8057[63]][_0x8057[1352]],
                        removeAttr: this[_0x8057[63]][_0x8057[346]],
                        allowedAttr: this[_0x8057[63]][_0x8057[1344]],
                        removeWithoutAttr: this[_0x8057[63]][_0x8057[1353]],
                        removeEmpty: this[_0x8057[63]][_0x8057[355]]
                    };
                    $[_0x8057[246]](this[_0x8057[59]][_0x8057[1348]], options);
                    html = this[_0x8057[59]][_0x8057[1349]](html);
                    this[_0x8057[59]][_0x8057[1354]] = $(_0x8057[394])[_0x8057[327]](html);
                    this[_0x8057[59]][_0x8057[1350]]();
                    this[_0x8057[59]][_0x8057[1351]]();
                    this[_0x8057[59]][_0x8057[1355]]();
                    this[_0x8057[59]][_0x8057[346]]();
                    this[_0x8057[59]][_0x8057[355]]();
                    this[_0x8057[59]][_0x8057[1356]]();
                    this[_0x8057[59]][_0x8057[1352]]();
                    this[_0x8057[59]][_0x8057[1353]]();
                    html = this[_0x8057[59]][_0x8057[1354]][_0x8057[68]]();
                    this[_0x8057[59]][_0x8057[1354]][_0x8057[331]]();
                    return html;
                },
                removeComments: function(html) {
                    if (!this[_0x8057[59]][_0x8057[1348]][_0x8057[1349]]) {
                        return html;
                    };
                    return html[_0x8057[541]](/<!--[\s\S]*?-->/gi, _0x8057[255]);
                },
                replaceTags: function(html) {
                    if (!this[_0x8057[59]][_0x8057[1348]][_0x8057[1350]]) {
                        return html;
                    };
                    var len = this[_0x8057[59]][_0x8057[1348]][_0x8057[1350]][_0x8057[21]];
                    var replacement = [],
                        rTags = [];
                    for (var i = 0; i < len; i++) {
                        rTags[_0x8057[16]](this[_0x8057[59]][_0x8057[1348]][_0x8057[1350]][i][1]);
                        replacement[_0x8057[16]](this[_0x8057[59]][_0x8057[1348]][_0x8057[1350]][i][0]);
                    };
                    this[_0x8057[59]][_0x8057[1354]][_0x8057[332]](replacement[_0x8057[241]](_0x8057[357]))[_0x8057[20]]($[_0x8057[281]](function(n, s) {
                        var tag = rTags[n];
                        $(s)[_0x8057[284]](function() {
                            var replaced = $(_0x8057[320] + tag + _0x8057[1357])[_0x8057[327]]($(this)[_0x8057[336]]());
                            for (var i = 0; i < this[_0x8057[910]][_0x8057[21]]; i++) {
                                replaced[_0x8057[276]](this[_0x8057[910]][i][_0x8057[286]], this[_0x8057[910]][i][_0x8057[309]]);
                            };
                            return replaced;
                        });
                    }, this));
                    return html;
                },
                replaceStyles: function() {
                    if (!this[_0x8057[59]][_0x8057[1348]][_0x8057[1351]]) {
                        return;
                    };
                    var len = this[_0x8057[59]][_0x8057[1348]][_0x8057[1351]][_0x8057[21]];
                    this[_0x8057[59]][_0x8057[1354]][_0x8057[332]](_0x8057[101])[_0x8057[20]]($[_0x8057[281]](function(n, s) {
                        var $el = $(s);
                        var style = $el[_0x8057[276]](_0x8057[90]);
                        for (var i = 0; i < len; i++) {
                            if (style && style[_0x8057[647]](new RegExp(_0x8057[811] + this[_0x8057[59]][_0x8057[1348]][_0x8057[1351]][i][0], _0x8057[123]))) {
                                var tagName = this[_0x8057[59]][_0x8057[1348]][_0x8057[1351]][i][1];
                                $el[_0x8057[284]](function() {
                                    var tag = document[_0x8057[652]](tagName);
                                    return $(tag)[_0x8057[327]]($(this)[_0x8057[336]]());
                                });
                            };
                        };
                    }, this));
                },
                removeTags: function() {
                    if (!this[_0x8057[59]][_0x8057[1348]][_0x8057[642]] && this[_0x8057[59]][_0x8057[1348]][_0x8057[1343]]) {
                        this[_0x8057[59]][_0x8057[1354]][_0x8057[332]](_0x8057[635])[_0x8057[498]](this[_0x8057[59]][_0x8057[1348]][_0x8057[1343]][_0x8057[241]](_0x8057[357]))[_0x8057[20]](function(i, s) {
                            if (s[_0x8057[514]] === _0x8057[255]) {
                                $(s)[_0x8057[331]]();
                            } else {
                                $(s)[_0x8057[336]]()[_0x8057[335]]();
                            };
                        });
                    };
                    if (this[_0x8057[59]][_0x8057[1348]][_0x8057[642]]) {
                        this[_0x8057[59]][_0x8057[1354]][_0x8057[332]](this[_0x8057[59]][_0x8057[1348]][_0x8057[642]][_0x8057[241]](_0x8057[357]))[_0x8057[20]](function(i, s) {
                            if (s[_0x8057[514]] === _0x8057[255]) {
                                $(s)[_0x8057[331]]();
                            } else {
                                $(s)[_0x8057[336]]()[_0x8057[335]]();
                            };
                        });
                    };
                },
                removeAttr: function() {
                    var len;
                    if (!this[_0x8057[59]][_0x8057[1348]][_0x8057[346]] && this[_0x8057[59]][_0x8057[1348]][_0x8057[1344]]) {
                        var allowedAttrTags = [],
                            allowedAttrData = [];
                        len = this[_0x8057[59]][_0x8057[1348]][_0x8057[1344]][_0x8057[21]];
                        for (var i = 0; i < len; i++) {
                            allowedAttrTags[_0x8057[16]](this[_0x8057[59]][_0x8057[1348]][_0x8057[1344]][i][0]);
                            allowedAttrData[_0x8057[16]](this[_0x8057[59]][_0x8057[1348]][_0x8057[1344]][i][1]);
                        };
                        this[_0x8057[59]][_0x8057[1354]][_0x8057[332]](_0x8057[635])[_0x8057[20]]($[_0x8057[281]](function(n, s) {
                            var $el = $(s);
                            var pos = $[_0x8057[306]]($el[0][_0x8057[311]][_0x8057[325]](), allowedAttrTags);
                            var attributesRemove = this[_0x8057[59]][_0x8057[1358]](pos, allowedAttrData, $el);
                            if (attributesRemove) {
                                $[_0x8057[20]](attributesRemove, function(z, f) {
                                    $el[_0x8057[346]](f);
                                });
                            };
                        }, this));
                    };
                    if (this[_0x8057[59]][_0x8057[1348]][_0x8057[346]]) {
                        len = this[_0x8057[59]][_0x8057[1348]][_0x8057[346]][_0x8057[21]];
                        for (var i = 0; i < len; i++) {
                            var attrs = this[_0x8057[59]][_0x8057[1348]][_0x8057[346]][i][1];
                            if ($[_0x8057[1359]](attrs)) {
                                attrs = attrs[_0x8057[241]](_0x8057[553]);
                            };
                            this[_0x8057[59]][_0x8057[1354]][_0x8057[332]](this[_0x8057[59]][_0x8057[1348]][_0x8057[346]][i][0])[_0x8057[346]](attrs);
                        };
                    };
                },
                removeAttrGetRemoves: function(pos, allowed, $el) {
                    var attributesRemove = [];
                    if (pos == -1) {
                        $[_0x8057[20]]($el[0][_0x8057[910]], function(i, item) {
                            attributesRemove[_0x8057[16]](item[_0x8057[286]]);
                        });
                    } else {
                        if (allowed[pos] == _0x8057[635]) {
                            attributesRemove = [];
                        } else {
                            $[_0x8057[20]]($el[0][_0x8057[910]], function(i, item) {
                                if ($[_0x8057[1359]](allowed[pos])) {
                                    if ($[_0x8057[306]](item[_0x8057[286]], allowed[pos]) == -1) {
                                        attributesRemove[_0x8057[16]](item[_0x8057[286]]);
                                    };
                                } else {
                                    if (allowed[pos] != item[_0x8057[286]]) {
                                        attributesRemove[_0x8057[16]](item[_0x8057[286]]);
                                    };
                                };
                            });
                        };
                    };
                    return attributesRemove;
                },
                removeAttrs: function(el, regex) {
                    regex = new RegExp(regex, _0x8057[561]);
                    return el[_0x8057[20]](function() {
                        var self = $(this);
                        var len = this[_0x8057[910]][_0x8057[21]] - 1;
                        for (var i = len; i >= 0; i--) {
                            var item = this[_0x8057[910]][i];
                            if (item && item[_0x8057[1360]] && item[_0x8057[286]][_0x8057[10]](regex) >= 0) {
                                self[_0x8057[346]](item[_0x8057[286]]);
                            };
                        };
                    });
                },
                removeEmpty: function() {
                    if (!this[_0x8057[59]][_0x8057[1348]][_0x8057[355]]) {
                        return;
                    };
                    this[_0x8057[59]][_0x8057[1354]][_0x8057[332]](this[_0x8057[59]][_0x8057[1348]][_0x8057[355]][_0x8057[241]](_0x8057[357]))[_0x8057[20]](function() {
                        var $el = $(this);
                        var text = $el[_0x8057[770]]();
                        text = text[_0x8057[541]](/[\u200B-\u200D\uFEFF]/g, _0x8057[255]);
                        text = text[_0x8057[541]](/&nbsp;/gi, _0x8057[255]);
                        text = text[_0x8057[541]](/\s/g, _0x8057[255]);
                        if (text === _0x8057[255] && $el[_0x8057[768]]()[_0x8057[21]] === 0) {
                            $el[_0x8057[331]]();
                        };
                    });
                },
                removeParagraphsInLists: function() {
                    this[_0x8057[59]][_0x8057[1354]][_0x8057[332]](_0x8057[1361])[_0x8057[336]]()[_0x8057[335]]();
                },
                removeDataAttr: function() {
                    if (!this[_0x8057[59]][_0x8057[1348]][_0x8057[1352]]) {
                        return;
                    };
                    var tags = this[_0x8057[59]][_0x8057[1348]][_0x8057[1352]];
                    if ($[_0x8057[1359]](this[_0x8057[59]][_0x8057[1348]][_0x8057[1352]])) {
                        tags = this[_0x8057[59]][_0x8057[1348]][_0x8057[1352]][_0x8057[241]](_0x8057[357]);
                    };
                    this[_0x8057[59]][_0x8057[1363]](this[_0x8057[59]][_0x8057[1354]][_0x8057[332]](tags), _0x8057[1362]);
                },
                removeWithoutAttr: function() {
                    if (!this[_0x8057[59]][_0x8057[1348]][_0x8057[1353]]) {
                        return;
                    };
                    this[_0x8057[59]][_0x8057[1354]][_0x8057[332]](this[_0x8057[59]][_0x8057[1348]][_0x8057[1353]][_0x8057[241]](_0x8057[357]))[_0x8057[20]](function() {
                        if (this[_0x8057[910]][_0x8057[21]] === 0) {
                            $(this)[_0x8057[336]]()[_0x8057[335]]();
                        };
                    });
                }
            };
        },
        toolbar: function() {
            return {
                init: function() {
                    return {
                        html: {
                            title: this[_0x8057[46]][_0x8057[292]](_0x8057[68]),
                            func: _0x8057[1364]
                        },
                        formatting: {
                            title: this[_0x8057[46]][_0x8057[292]](_0x8057[69]),
                            dropdown: {
                                p: {
                                    title: this[_0x8057[46]][_0x8057[292]](_0x8057[1365]),
                                    func: _0x8057[1366]
                                },
                                blockquote: {
                                    title: this[_0x8057[46]][_0x8057[292]](_0x8057[305]),
                                    func: _0x8057[1366]
                                },
                                pre: {
                                    title: this[_0x8057[46]][_0x8057[292]](_0x8057[35]),
                                    func: _0x8057[1366]
                                },
                                h1: {
                                    title: this[_0x8057[46]][_0x8057[292]](_0x8057[1367]),
                                    func: _0x8057[1366]
                                },
                                h2: {
                                    title: this[_0x8057[46]][_0x8057[292]](_0x8057[1368]),
                                    func: _0x8057[1366]
                                },
                                h3: {
                                    title: this[_0x8057[46]][_0x8057[292]](_0x8057[1369]),
                                    func: _0x8057[1366]
                                },
                                h4: {
                                    title: this[_0x8057[46]][_0x8057[292]](_0x8057[1370]),
                                    func: _0x8057[1366]
                                },
                                h5: {
                                    title: this[_0x8057[46]][_0x8057[292]](_0x8057[1371]),
                                    func: _0x8057[1366]
                                }
                            }
                        },
                        bold: {
                            title: this[_0x8057[46]][_0x8057[292]](_0x8057[70]),
                            func: _0x8057[108]
                        },
                        italic: {
                            title: this[_0x8057[46]][_0x8057[292]](_0x8057[71]),
                            func: _0x8057[108]
                        },
                        deleted: {
                            title: this[_0x8057[46]][_0x8057[292]](_0x8057[72]),
                            func: _0x8057[108]
                        },
                        underline: {
                            title: this[_0x8057[46]][_0x8057[292]](_0x8057[102]),
                            func: _0x8057[108]
                        },
                        unorderedlist: {
                            title: _0x8057[1372] + this[_0x8057[46]][_0x8057[292]](_0x8057[73]),
                            func: _0x8057[112]
                        },
                        orderedlist: {
                            title: _0x8057[1373] + this[_0x8057[46]][_0x8057[292]](_0x8057[74]),
                            func: _0x8057[112]
                        },
                        outdent: {
                            title: _0x8057[1374] + this[_0x8057[46]][_0x8057[292]](_0x8057[75]),
                            func: _0x8057[1375]
                        },
                        indent: {
                            title: _0x8057[1376] + this[_0x8057[46]][_0x8057[292]](_0x8057[41]),
                            func: _0x8057[1377]
                        },
                        image: {
                            title: this[_0x8057[46]][_0x8057[292]](_0x8057[40]),
                            func: _0x8057[1378]
                        },
                        file: {
                            title: this[_0x8057[46]][_0x8057[292]](_0x8057[38]),
                            func: _0x8057[1379]
                        },
                        link: {
                            title: this[_0x8057[46]][_0x8057[292]](_0x8057[48]),
                            dropdown: {
                                link: {
                                    title: this[_0x8057[46]][_0x8057[292]](_0x8057[1027]),
                                    func: _0x8057[111]
                                },
                                unlink: {
                                    title: this[_0x8057[46]][_0x8057[292]](_0x8057[1173]),
                                    func: _0x8057[1380]
                                }
                            }
                        },
                        alignment: {
                            title: this[_0x8057[46]][_0x8057[292]](_0x8057[27]),
                            dropdown: {
                                left: {
                                    title: this[_0x8057[46]][_0x8057[292]](_0x8057[1381]),
                                    func: _0x8057[1382]
                                },
                                center: {
                                    title: this[_0x8057[46]][_0x8057[292]](_0x8057[1383]),
                                    func: _0x8057[1384]
                                },
                                right: {
                                    title: this[_0x8057[46]][_0x8057[292]](_0x8057[1385]),
                                    func: _0x8057[1386]
                                },
                                justify: {
                                    title: this[_0x8057[46]][_0x8057[292]](_0x8057[1387]),
                                    func: _0x8057[1388]
                                }
                            }
                        },
                        horizontalrule: {
                            title: this[_0x8057[46]][_0x8057[292]](_0x8057[76]),
                            func: _0x8057[1389]
                        }
                    };
                },
                build: function() {
                    this[_0x8057[60]][_0x8057[1390]]();
                    this[_0x8057[60]][_0x8057[1391]]();
                    this[_0x8057[60]][_0x8057[1392]]();
                    if (this[_0x8057[63]][_0x8057[492]][_0x8057[21]] === 0) {
                        return;
                    };
                    this[_0x8057[494]] = this[_0x8057[60]][_0x8057[1393]]();
                    this[_0x8057[60]][_0x8057[1394]]();
                    this[_0x8057[60]][_0x8057[327]]();
                    this[_0x8057[60]][_0x8057[1395]]();
                    this[_0x8057[60]][_0x8057[1396]]();
                    this[_0x8057[60]][_0x8057[1397]]();
                    if (this[_0x8057[63]][_0x8057[1156]]) {
                        this[_0x8057[261]][_0x8057[425]](_0x8057[1398], $[_0x8057[281]](this[_0x8057[51]][_0x8057[492]], this));
                    };
                },
                createContainer: function() {
                    return $(_0x8057[1054])[_0x8057[347]](_0x8057[1400])[_0x8057[276]](_0x8057[386], _0x8057[1399] + this[_0x8057[230]]);
                },
                setFormattingTags: function() {
                    $[_0x8057[20]](this[_0x8057[63]][_0x8057[60]][_0x8057[69]][_0x8057[37]], $[_0x8057[281]](function(i, s) {
                        if ($[_0x8057[306]](i, this[_0x8057[63]][_0x8057[69]]) == -1) {
                            delete this[_0x8057[63]][_0x8057[60]][_0x8057[69]][_0x8057[37]][i];
                        };
                    }, this));
                },
                loadButtons: function() {
                    $[_0x8057[20]](this[_0x8057[63]][_0x8057[492]], $[_0x8057[281]](function(i, btnName) {
                        if (!this[_0x8057[63]][_0x8057[60]][btnName]) {
                            return;
                        };
                        if (btnName === _0x8057[38]) {
                            if (this[_0x8057[63]][_0x8057[754]] === false) {
                                return;
                            } else {
                                if (!this[_0x8057[63]][_0x8057[754]] && this[_0x8057[63]][_0x8057[1401]] === false) {
                                    return;
                                };
                            };
                        };
                        if (btnName === _0x8057[40]) {
                            if (this[_0x8057[63]][_0x8057[777]] === false) {
                                return;
                            } else {
                                if (!this[_0x8057[63]][_0x8057[777]] && this[_0x8057[63]][_0x8057[1401]] === false) {
                                    return;
                                };
                            };
                        };
                        var btnObject = this[_0x8057[63]][_0x8057[60]][btnName];
                        this[_0x8057[494]][_0x8057[327]]($(_0x8057[507])[_0x8057[327]](this[_0x8057[32]][_0x8057[31]](btnName, btnObject)));
                    }, this));
                },
                append: function() {
                    if (this[_0x8057[63]][_0x8057[1402]]) {
                        this[_0x8057[494]][_0x8057[347]](_0x8057[1403]);
                        $(this[_0x8057[63]][_0x8057[1402]])[_0x8057[68]](this.$toolbar);
                    } else {
                        this[_0x8057[381]][_0x8057[328]](this.$toolbar);
                    };
                },
                setFixed: function() {
                    if (!this[_0x8057[62]][_0x8057[470]]()) {
                        return;
                    };
                    if (this[_0x8057[63]][_0x8057[1402]]) {
                        return;
                    };
                    if (!this[_0x8057[63]][_0x8057[1404]]) {
                        return;
                    };
                    this[_0x8057[60]][_0x8057[1405]]();
                    $(this[_0x8057[63]][_0x8057[743]])[_0x8057[425]](_0x8057[1406], $[_0x8057[281]](this[_0x8057[60]][_0x8057[1405]], this));
                },
                setOverflow: function() {
                    if (this[_0x8057[62]][_0x8057[734]]() && this[_0x8057[63]][_0x8057[1407]]) {
                        this[_0x8057[494]][_0x8057[347]](_0x8057[1408]);
                    };
                },
                isButtonSourceNeeded: function() {
                    if (this[_0x8057[63]][_0x8057[291]]) {
                        return;
                    };
                    var index = this[_0x8057[63]][_0x8057[492]][_0x8057[648]](_0x8057[68]);
                    if (index !== -1) {
                        this[_0x8057[63]][_0x8057[492]][_0x8057[1347]](index, 1);
                    };
                },
                hideButtons: function() {
                    if (this[_0x8057[63]][_0x8057[1409]][_0x8057[21]] === 0) {
                        return;
                    };
                    $[_0x8057[20]](this[_0x8057[63]][_0x8057[1409]], $[_0x8057[281]](function(i, s) {
                        var index = this[_0x8057[63]][_0x8057[492]][_0x8057[648]](s);
                        this[_0x8057[63]][_0x8057[492]][_0x8057[1347]](index, 1);
                    }, this));
                },
                hideButtonsOnMobile: function() {
                    if (!this[_0x8057[62]][_0x8057[734]]() || this[_0x8057[63]][_0x8057[1410]][_0x8057[21]] === 0) {
                        return;
                    };
                    $[_0x8057[20]](this[_0x8057[63]][_0x8057[1410]], $[_0x8057[281]](function(i, s) {
                        var index = this[_0x8057[63]][_0x8057[492]][_0x8057[648]](s);
                        this[_0x8057[63]][_0x8057[492]][_0x8057[1347]](index, 1);
                    }, this));
                },
                observeScroll: function() {
                    var scrollTop = $(this[_0x8057[63]][_0x8057[743]])[_0x8057[699]]();
                    var boxTop = 1;
                    if (this[_0x8057[63]][_0x8057[743]] === document) {
                        boxTop = this[_0x8057[381]][_0x8057[480]]()[_0x8057[482]];
                    };
                    if (scrollTop > boxTop) {
                        this[_0x8057[60]][_0x8057[1411]](scrollTop, boxTop);
                    } else {
                        this[_0x8057[60]][_0x8057[1412]]();
                    };
                },
                observeScrollEnable: function(scrollTop, boxTop) {
                    var top = this[_0x8057[63]][_0x8057[741]] + scrollTop - boxTop;
                    var left = 0;
                    var end = boxTop + this[_0x8057[381]][_0x8057[702]]() + 30;
                    var width = this[_0x8057[381]][_0x8057[486]]();
                    this[_0x8057[494]][_0x8057[347]](_0x8057[740]);
                    this[_0x8057[494]][_0x8057[274]]({
                        position: _0x8057[744],
                        width: width,
                        top: top + _0x8057[484],
                        left: left
                    });
                    this[_0x8057[60]][_0x8057[1413]]();
                    this[_0x8057[494]][_0x8057[274]](_0x8057[1414], (scrollTop < end) ? _0x8057[1415] : _0x8057[1104]);
                },
                observeScrollDisable: function() {
                    this[_0x8057[494]][_0x8057[274]]({
                        position: _0x8057[1416],
                        width: _0x8057[806],
                        top: 0,
                        left: 0,
                        visibility: _0x8057[1415]
                    });
                    this[_0x8057[60]][_0x8057[1417]]();
                    this[_0x8057[494]][_0x8057[350]](_0x8057[740]);
                },
                setDropdownsFixed: function() {
                    var top = this[_0x8057[494]][_0x8057[483]]() + this[_0x8057[63]][_0x8057[741]];
                    var position = _0x8057[742];
                    if (this[_0x8057[63]][_0x8057[743]] !== document) {
                        top = (this[_0x8057[494]][_0x8057[483]]() + this[_0x8057[494]][_0x8057[480]]()[_0x8057[482]]) + this[_0x8057[63]][_0x8057[741]];
                        position = _0x8057[744];
                    };
                    $(_0x8057[751])[_0x8057[20]](function() {
                        $(this)[_0x8057[274]]({
                            position: position,
                            top: top + _0x8057[484]
                        });
                    });
                },
                unsetDropdownsFixed: function() {
                    var top = (this[_0x8057[494]][_0x8057[483]]() + this[_0x8057[494]][_0x8057[480]]()[_0x8057[482]]);
                    $(_0x8057[751])[_0x8057[20]](function() {
                        $(this)[_0x8057[274]]({
                            position: _0x8057[744],
                            top: top + _0x8057[484]
                        });
                    });
                }
            };
        },
        upload: function() {
            return {
                init: function(id, url, callback) {
                    this[_0x8057[61]][_0x8057[1418]] = false;
                    this[_0x8057[61]][_0x8057[1419]] = callback;
                    this[_0x8057[61]][_0x8057[1036]] = url;
                    this[_0x8057[61]][_0x8057[1420]] = $(id);
                    this[_0x8057[61]][_0x8057[1421]] = $(_0x8057[1422]);
                    this[_0x8057[61]][_0x8057[1423]] = $(_0x8057[1425])[_0x8057[770]](_0x8057[1424]);
                    this[_0x8057[61]][_0x8057[1426]] = $(_0x8057[1427]);
                    this[_0x8057[61]][_0x8057[1423]][_0x8057[327]](this[_0x8057[61]].$input);
                    this[_0x8057[61]][_0x8057[1421]][_0x8057[327]](this[_0x8057[61]].$placeholdler);
                    this[_0x8057[61]][_0x8057[1420]][_0x8057[327]](this[_0x8057[61]].$droparea);
                    this[_0x8057[61]][_0x8057[1421]][_0x8057[708]](_0x8057[1428]);
                    this[_0x8057[61]][_0x8057[1426]][_0x8057[708]](_0x8057[1428]);
                    this[_0x8057[61]][_0x8057[1421]][_0x8057[425]](_0x8057[1429], $[_0x8057[281]](this[_0x8057[61]][_0x8057[818]], this));
                    this[_0x8057[61]][_0x8057[1421]][_0x8057[425]](_0x8057[1430], $[_0x8057[281]](this[_0x8057[61]][_0x8057[1431]], this));
                    this[_0x8057[61]][_0x8057[1426]][_0x8057[425]](_0x8057[1432], $[_0x8057[281]](function(e) {
                        e = e[_0x8057[421]] || e;
                        this[_0x8057[61]][_0x8057[1433]](this[_0x8057[61]][_0x8057[1426]][0][_0x8057[416]][0], e);
                    }, this));
                    this[_0x8057[61]][_0x8057[1421]][_0x8057[425]](_0x8057[1434], $[_0x8057[281]](function(e) {
                        e[_0x8057[413]]();
                        this[_0x8057[61]][_0x8057[1421]][_0x8057[350]](_0x8057[1436])[_0x8057[347]](_0x8057[1435]);
                        this[_0x8057[61]][_0x8057[845]](e);
                    }, this));
                },
                directUpload: function(file, e) {
                    this[_0x8057[61]][_0x8057[1418]] = true;
                    this[_0x8057[61]][_0x8057[1433]](file, e);
                },
                onDrop: function(e) {
                    e = e[_0x8057[421]] || e;
                    var files = e[_0x8057[417]][_0x8057[416]];
                    this[_0x8057[61]][_0x8057[1433]](files[0], e);
                },
                traverseFile: function(file, e) {
                    if (this[_0x8057[63]][_0x8057[1401]]) {
                        this[_0x8057[61]][_0x8057[1437]](file);
                        this[_0x8057[61]][_0x8057[1438]](file);
                        return;
                    };
                    var formData = !!window[_0x8057[422]] ? new FormData() : null;
                    if (window[_0x8057[422]]) {
                        this[_0x8057[61]][_0x8057[1437]](file);
                        var name = (this[_0x8057[61]][_0x8057[265]] == _0x8057[40]) ? this[_0x8057[63]][_0x8057[1439]] : this[_0x8057[63]][_0x8057[1440]];
                        formData[_0x8057[327]](name, file);
                    };
                    this[_0x8057[55]][_0x8057[481]]();
                    this[_0x8057[61]][_0x8057[1441]](formData, e);
                },
                setConfig: function(file) {
                    this[_0x8057[61]][_0x8057[1442]](file);
                    if (this[_0x8057[61]][_0x8057[1418]]) {
                        this[_0x8057[61]][_0x8057[1036]] = (this[_0x8057[61]][_0x8057[265]] == _0x8057[40]) ? this[_0x8057[63]][_0x8057[777]] : this[_0x8057[63]][_0x8057[754]];
                        this[_0x8057[61]][_0x8057[1419]] = (this[_0x8057[61]][_0x8057[265]] == _0x8057[40]) ? this[_0x8057[40]][_0x8057[43]] : this[_0x8057[38]][_0x8057[43]];
                    };
                },
                getType: function(file) {
                    this[_0x8057[61]][_0x8057[265]] = _0x8057[40];
                    if (this[_0x8057[63]][_0x8057[1443]][_0x8057[648]](file[_0x8057[265]]) == -1) {
                        this[_0x8057[61]][_0x8057[265]] = _0x8057[38];
                    };
                },
                getHiddenFields: function(obj, fd) {
                    if (obj === false || typeof obj !== _0x8057[631]) {
                        return fd;
                    };
                    $[_0x8057[20]](obj, $[_0x8057[281]](function(k, v) {
                        if (v !== null && v.toString()[_0x8057[648]](_0x8057[1039]) === 0) {
                            v = $(v)[_0x8057[388]]();
                        };
                        fd[_0x8057[327]](k, v);
                    }, this));
                    return fd;
                },
                sendData: function(formData, e) {
                    if (this[_0x8057[61]][_0x8057[265]] == _0x8057[40]) {
                        formData = this[_0x8057[61]][_0x8057[1445]](this[_0x8057[63]][_0x8057[1444]], formData);
                        formData = this[_0x8057[61]][_0x8057[1445]](this[_0x8057[61]][_0x8057[1446]], formData);
                    } else {
                        formData = this[_0x8057[61]][_0x8057[1445]](this[_0x8057[63]][_0x8057[1447]], formData);
                        formData = this[_0x8057[61]][_0x8057[1445]](this[_0x8057[61]][_0x8057[1448]], formData);
                    };
                    var xhr = new XMLHttpRequest();
                    xhr[_0x8057[1450]](_0x8057[1449], this[_0x8057[61]][_0x8057[1036]]);
                    xhr[_0x8057[1451]] = $[_0x8057[281]](function() {
                        if (xhr[_0x8057[1452]] == 4) {
                            var data = xhr[_0x8057[1453]];
                            data = data[_0x8057[541]](/^\[/, _0x8057[255]);
                            data = data[_0x8057[541]](/\]$/, _0x8057[255]);
                            var json;
                            try {
                                json = (typeof data === _0x8057[8] ? $[_0x8057[298]](data) : data);
                            } catch (err) {
                                json = {
                                    error: true
                                };
                            };
                            this[_0x8057[55]][_0x8057[397]]();
                            if (!this[_0x8057[61]][_0x8057[1418]]) {
                                this[_0x8057[61]][_0x8057[1421]][_0x8057[350]](_0x8057[1435]);
                            };
                            this[_0x8057[61]][_0x8057[1419]](json, this[_0x8057[61]][_0x8057[1418]], e);
                        };
                    }, this);
                    xhr[_0x8057[1454]](formData);
                },
                onDrag: function(e) {
                    e[_0x8057[413]]();
                    this[_0x8057[61]][_0x8057[1421]][_0x8057[347]](_0x8057[1436]);
                },
                onDragLeave: function(e) {
                    e[_0x8057[413]]();
                    this[_0x8057[61]][_0x8057[1421]][_0x8057[350]](_0x8057[1436]);
                },
                clearImageFields: function() {
                    this[_0x8057[61]][_0x8057[1446]] = {};
                },
                addImageFields: function(name, value) {
                    this[_0x8057[61]][_0x8057[1446]][name] = value;
                },
                removeImageFields: function(name) {
                    delete this[_0x8057[61]][_0x8057[1446]][name];
                },
                clearFileFields: function() {
                    this[_0x8057[61]][_0x8057[1448]] = {};
                },
                addFileFields: function(name, value) {
                    this[_0x8057[61]][_0x8057[1448]][name] = value;
                },
                removeFileFields: function(name) {
                    delete this[_0x8057[61]][_0x8057[1448]][name];
                },
                s3uploadFile: function(file) {
                    this[_0x8057[61]][_0x8057[1456]](file, $[_0x8057[281]](function(signedURL) {
                        this[_0x8057[61]][_0x8057[1455]](file, signedURL);
                    }, this));
                },
                s3executeOnSignedUrl: function(file, callback) {
                    var xhr = new XMLHttpRequest();
                    var mark = _0x8057[1314];
                    if (this[_0x8057[63]][_0x8057[1401]][_0x8057[10]](/\?/) != _0x8057[11]) {
                        mark = _0x8057[661];
                    };
                    xhr[_0x8057[1450]](_0x8057[1457], this[_0x8057[63]][_0x8057[1401]] + mark + _0x8057[1458] + file[_0x8057[286]] + _0x8057[1459] + file[_0x8057[265]], true);
                    if (xhr[_0x8057[1460]]) {
                        xhr[_0x8057[1460]](_0x8057[1461]);
                    };
                    var that = this;
                    xhr[_0x8057[1451]] = function(e) {
                        if (this[_0x8057[1452]] == 4 && this[_0x8057[1462]] == 200) {
                            that[_0x8057[55]][_0x8057[481]]();
                            callback(decodeURIComponent(this[_0x8057[1453]]));
                        } else {
                            if (this[_0x8057[1452]] == 4 && this[_0x8057[1462]] != 200) {};
                        };
                    };
                    xhr[_0x8057[1454]]();
                },
                s3createCORSRequest: function(method, url) {
                    var xhr = new XMLHttpRequest();
                    if (_0x8057[1463] in xhr) {
                        xhr[_0x8057[1450]](method, url, true);
                    } else {
                        if (typeof XDomainRequest != _0x8057[14]) {
                            xhr = new XDomainRequest();
                            xhr[_0x8057[1450]](method, url);
                        } else {
                            xhr = null;
                        };
                    };
                    return xhr;
                },
                s3uploadToS3: function(file, url) {
                    var xhr = this[_0x8057[61]][_0x8057[1465]](_0x8057[1464], url);
                    if (!xhr) {} else {
                        xhr[_0x8057[1466]] = $[_0x8057[281]](function() {
                            if (xhr[_0x8057[1462]] == 200) {
                                this[_0x8057[55]][_0x8057[397]]();
                                var s3file = url[_0x8057[13]](_0x8057[1314]);
                                if (!s3file[0]) {
                                    return false;
                                };
                                if (!this[_0x8057[61]][_0x8057[1418]]) {
                                    this[_0x8057[61]][_0x8057[1421]][_0x8057[350]](_0x8057[1435]);
                                };
                                var json = {
                                    filelink: s3file[0]
                                };
                                if (this[_0x8057[61]][_0x8057[265]] == _0x8057[38]) {
                                    var arr = s3file[0][_0x8057[13]](_0x8057[1289]);
                                    json[_0x8057[759]] = arr[arr[_0x8057[21]] - 1];
                                };
                                this[_0x8057[61]][_0x8057[1419]](json, this[_0x8057[61]][_0x8057[1418]], false);
                            } else {};
                        }, this);
                        xhr[_0x8057[1467]] = function() {};
                        xhr[_0x8057[61]][_0x8057[1468]] = function(e) {};
                        xhr[_0x8057[1470]](_0x8057[1469], file[_0x8057[265]]);
                        xhr[_0x8057[1470]](_0x8057[1471], _0x8057[1472]);
                        xhr[_0x8057[1454]](file);
                    };
                }
            };
        },
        utils: function() {
            return {
                isMobile: function() {
                    return /(iPhone|iPod|BlackBerry|Android)/ [_0x8057[604]](navigator[_0x8057[1473]]);
                },
                isDesktop: function() {
                    return !/(iPhone|iPod|iPad|BlackBerry|Android)/ [_0x8057[604]](navigator[_0x8057[1473]]);
                },
                isString: function(obj) {
                    return Object[_0x8057[2]][_0x8057[1474]][_0x8057[6]](obj) == _0x8057[1475];
                },
                isEmpty: function(html, removeEmptyTags) {
                    html = html[_0x8057[541]](/[\u200B-\u200D\uFEFF]/g, _0x8057[255]);
                    html = html[_0x8057[541]](/&nbsp;/gi, _0x8057[255]);
                    html = html[_0x8057[541]](/<\/?br\s?\/?>/g, _0x8057[255]);
                    html = html[_0x8057[541]](/\s/g, _0x8057[255]);
                    html = html[_0x8057[541]](/^<p>[^\W\w\D\d]*?<\/p>$/i, _0x8057[255]);
                    html = html[_0x8057[541]](/<iframe(.*?[^>])>$/i, _0x8057[628]);
                    if (removeEmptyTags !== false) {
                        html = html[_0x8057[541]](/<[^\/>][^>]*><\/[^>]+>/gi, _0x8057[255]);
                        html = html[_0x8057[541]](/<[^\/>][^>]*><\/[^>]+>/gi, _0x8057[255]);
                    };
                    html = $[_0x8057[390]](html);
                    return html === _0x8057[255];
                },
                normalize: function(str) {
                    if (typeof(str) === _0x8057[14]) {
                        return 0;
                    };
                    return parseInt(str[_0x8057[541]](_0x8057[484], _0x8057[255]), 10);
                },
                hexToRgb: function(hex) {
                    if (typeof hex == _0x8057[14]) {
                        return;
                    };
                    if (hex[_0x8057[10]](/^#/) == -1) {
                        return hex;
                    };
                    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                    hex = hex[_0x8057[541]](shorthandRegex, function(m, r, g, b) {
                        return r + r + g + g + b + b;
                    });
                    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i [_0x8057[1342]](hex);
                    return _0x8057[1476] + parseInt(result[1], 16) + _0x8057[668] + parseInt(result[2], 16) + _0x8057[668] + parseInt(result[3], 16) + _0x8057[1311];
                },
                getOuterHtml: function(el) {
                    return $(_0x8057[548])[_0x8057[327]]($(el)[_0x8057[1477]](0)[_0x8057[1011]]())[_0x8057[68]]();
                },
                getAlignmentElement: function(el) {
                    if ($[_0x8057[306]](el[_0x8057[311]], this[_0x8057[63]][_0x8057[236]]) !== -1) {
                        return $(el);
                    } else {
                        return $(el)[_0x8057[352]](this[_0x8057[63]][_0x8057[236]].toString()[_0x8057[325]](), this[_0x8057[261]][0]);
                    };
                },
                removeEmptyAttr: function(el, attr) {
                    var $el = $(el);
                    if (typeof $el[_0x8057[276]](attr) == _0x8057[14]) {
                        return true;
                    };
                    if ($el[_0x8057[276]](attr) === _0x8057[255]) {
                        $el[_0x8057[346]](attr);
                        return true;
                    };
                    return false;
                },
                removeEmpty: function(i, s) {
                    var $s = $(s);
                    $s[_0x8057[332]](_0x8057[1478])[_0x8057[346]](_0x8057[90])[_0x8057[346]](_0x8057[301]);
                    if ($s[_0x8057[332]](_0x8057[1479])[_0x8057[21]] !== 0) {
                        return;
                    };
                    var text = $[_0x8057[390]]($s[_0x8057[770]]());
                    if (this[_0x8057[62]][_0x8057[293]](text, false)) {
                        $s[_0x8057[331]]();
                    };
                },
                saveScroll: function() {
                    if (this[_0x8057[62]][_0x8057[588]]()) {
                        return;
                    };
                    this[_0x8057[1480]] = this[_0x8057[261]][_0x8057[699]]();
                    this[_0x8057[1232]] = $(window)[_0x8057[699]]();
                    if (this[_0x8057[63]][_0x8057[1481]]) {
                        this[_0x8057[1482]] = $(this[_0x8057[63]][_0x8057[1481]])[_0x8057[699]]();
                    };
                },
                restoreScroll: function() {
                    if (typeof this[_0x8057[1019]] === _0x8057[14] && typeof this[_0x8057[1232]] === _0x8057[14]) {
                        return;
                    };
                    $(window)[_0x8057[699]](this[_0x8057[1232]]);
                    this[_0x8057[261]][_0x8057[699]](this[_0x8057[1480]]);
                    if (this[_0x8057[63]][_0x8057[1481]]) {
                        $(this[_0x8057[63]][_0x8057[1481]])[_0x8057[699]](this[_0x8057[1482]]);
                    };
                },
                createSpaceElement: function() {
                    var space = document[_0x8057[652]](_0x8057[101]);
                    space[_0x8057[942]] = _0x8057[967];
                    space[_0x8057[514]] = this[_0x8057[63]][_0x8057[515]];
                    return space;
                },
                removeInlineTags: function(node) {
                    var tags = this[_0x8057[63]][_0x8057[678]];
                    tags[_0x8057[16]](_0x8057[101]);
                    if (node[_0x8057[311]] == _0x8057[155]) {
                        tags[_0x8057[16]](_0x8057[118]);
                    };
                    $(node)[_0x8057[332]](tags[_0x8057[241]](_0x8057[357]))[_0x8057[498]](_0x8057[1259])[_0x8057[336]]()[_0x8057[335]]();
                },
                replaceWithContents: function(node, removeInlineTags) {
                    var self = this;
                    $(node)[_0x8057[284]](function() {
                        if (removeInlineTags === true) {
                            self[_0x8057[62]][_0x8057[333]](this);
                        };
                        return $(this)[_0x8057[336]]();
                    });
                },
                replaceToTag: function(node, tag, removeInlineTags) {
                    var replacement;
                    var self = this;
                    $(node)[_0x8057[284]](function() {
                        replacement = $(_0x8057[320] + tag + _0x8057[1357])[_0x8057[327]]($(this)[_0x8057[336]]());
                        for (var i = 0; i < this[_0x8057[910]][_0x8057[21]]; i++) {
                            replacement[_0x8057[276]](this[_0x8057[910]][i][_0x8057[286]], this[_0x8057[910]][i][_0x8057[309]]);
                        };
                        if (removeInlineTags === true) {
                            self[_0x8057[62]][_0x8057[333]](replacement);
                        };
                        return replacement;
                    });
                    return replacement;
                },
                isStartOfElement: function() {
                    var block = this[_0x8057[56]][_0x8057[323]]();
                    if (!block) {
                        return false;
                    };
                    var offset = this[_0x8057[33]][_0x8057[1483]](block);
                    return (offset === 0) ? true : false;
                },
                isEndOfElement: function() {
                    var block = this[_0x8057[56]][_0x8057[323]]();
                    if (!block) {
                        return false;
                    };
                    var offset = this[_0x8057[33]][_0x8057[1483]](block);
                    var text = $[_0x8057[390]]($(block)[_0x8057[770]]())[_0x8057[541]](/\n\r\n/g, _0x8057[255]);
                    return (offset == text[_0x8057[21]]) ? true : false;
                },
                isEndOfEditor: function() {
                    var block = this[_0x8057[261]][0];
                    var offset = this[_0x8057[33]][_0x8057[1483]](block);
                    var text = $[_0x8057[390]]($(block)[_0x8057[770]]())[_0x8057[541]](/\n\r\n/g, _0x8057[255]);
                    return (offset == text[_0x8057[21]]) ? true : false;
                },
                isBlock: function(block) {
                    block = block[0] || block;
                    return block && this[_0x8057[62]][_0x8057[513]](block[_0x8057[311]]);
                },
                isBlockTag: function(tag) {
                    if (typeof tag == _0x8057[14]) {
                        return false;
                    };
                    return this[_0x8057[238]][_0x8057[604]](tag);
                },
                isTag: function(current, tag) {
                    var element = $(current)[_0x8057[352]](tag);
                    if (element[_0x8057[21]] == 1) {
                        return element[0];
                    };
                    return false;
                },
                isSelectAll: function() {
                    return this[_0x8057[1484]];
                },
                enableSelectAll: function() {
                    this[_0x8057[1484]] = true;
                },
                disableSelectAll: function() {
                    this[_0x8057[1484]] = false;
                },
                isRedactorParent: function(el) {
                    if (!el) {
                        return false;
                    };
                    if ($(el)[_0x8057[452]](_0x8057[1485])[_0x8057[21]] === 0 || $(el)[_0x8057[448]](_0x8057[396])) {
                        return false;
                    };
                    return el;
                },
                isCurrentOrParentHeader: function() {
                    return this[_0x8057[62]][_0x8057[590]]([_0x8057[135], _0x8057[136], _0x8057[137], _0x8057[138], _0x8057[139], _0x8057[140]]);
                },
                isCurrentOrParent: function(tagName) {
                    var parent = this[_0x8057[56]][_0x8057[911]]();
                    var current = this[_0x8057[56]][_0x8057[883]]();
                    if ($[_0x8057[1359]](tagName)) {
                        var matched = 0;
                        $[_0x8057[20]](tagName, $[_0x8057[281]](function(i, s) {
                            if (this[_0x8057[62]][_0x8057[1486]](current, parent, s)) {
                                matched++;
                            };
                        }, this));
                        return (matched === 0) ? false : true;
                    } else {
                        return this[_0x8057[62]][_0x8057[1486]](current, parent, tagName);
                    };
                },
                isCurrentOrParentOne: function(current, parent, tagName) {
                    tagName = tagName[_0x8057[1487]]();
                    return parent && parent[_0x8057[311]] === tagName ? parent : current && current[_0x8057[311]] === tagName ? current : false;
                },
                isOldIe: function() {
                    return (this[_0x8057[62]][_0x8057[260]](_0x8057[259]) && parseInt(this[_0x8057[62]][_0x8057[260]](_0x8057[1488]), 10) < 9) ? true : false;
                },
                isLessIe10: function() {
                    return (this[_0x8057[62]][_0x8057[260]](_0x8057[259]) && parseInt(this[_0x8057[62]][_0x8057[260]](_0x8057[1488]), 10) < 10) ? true : false;
                },
                isIe11: function() {
                    return !!navigator[_0x8057[1473]][_0x8057[647]](/Trident\/7\./);
                },
                browser: function(browser) {
                    var ua = navigator[_0x8057[1473]][_0x8057[325]]();
                    var match = /(opr)[\/]([\w.]+)/ [_0x8057[1342]](ua) || /(chrome)[ \/]([\w.]+)/ [_0x8057[1342]](ua) || /(webkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/ [_0x8057[1342]](ua) || /(webkit)[ \/]([\w.]+)/ [_0x8057[1342]](ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/ [_0x8057[1342]](ua) || /(msie) ([\w.]+)/ [_0x8057[1342]](ua) || ua[_0x8057[648]](_0x8057[1489]) >= 0 && /(rv)(?::| )([\w.]+)/ [_0x8057[1342]](ua) || ua[_0x8057[648]](_0x8057[1490]) < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/ [_0x8057[1342]](ua) || [];
                    if (browser == _0x8057[1491]) {
                        return (typeof match[3] != _0x8057[14]) ? match[3] == _0x8057[1491] : false;
                    };
                    if (browser == _0x8057[1488]) {
                        return match[2];
                    };
                    if (browser == _0x8057[1492]) {
                        return (match[1] == _0x8057[1493] || match[1] == _0x8057[1492]);
                    };
                    if (match[1] == _0x8057[1494]) {
                        return browser == _0x8057[259];
                    };
                    if (match[1] == _0x8057[1495]) {
                        return browser == _0x8057[1492];
                    };
                    return browser == match[1];
                }
            };
        }
    };
    $(window)[_0x8057[425]](_0x8057[1496], function() {
        $(_0x8057[1497])[_0x8057[4]]();
    });
    Redactor[_0x8057[2]][_0x8057[22]][_0x8057[2]] = Redactor[_0x8057[2]];
    $[_0x8057[23]][_0x8057[5]][_0x8057[1008]] = function(protocol, convertLinks, convertUrlLinks, convertImageLinks, convertVideoLinks, linkSize) {
        var urlCheck = _0x8057[1498];
        var regex = new RegExp(urlCheck, _0x8057[563]);
        var rProtocol = /(https?|ftp):\/\//i;
        var urlImage = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/gi;
        var childNodes = (this[_0x8057[261]] ? this[_0x8057[261]][0] : this)[_0x8057[1499]],
            i = childNodes[_0x8057[21]];
        while (i--) {
            var n = childNodes[i];
            if (n[_0x8057[769]] === 3 && n[_0x8057[773]] !== _0x8057[155]) {
                var html = n[_0x8057[536]];
                if (convertVideoLinks && html) {
                    var iframeStart = _0x8057[1500],
                        iframeEnd = _0x8057[1501];
                    if (html[_0x8057[647]](reUrlYoutube)) {
                        html = html[_0x8057[541]](reUrlYoutube, iframeStart + _0x8057[1502] + iframeEnd);
                        $(n)[_0x8057[508]](html)[_0x8057[331]]();
                    } else {
                        if (html[_0x8057[647]](reUrlVimeo)) {
                            html = html[_0x8057[541]](reUrlVimeo, iframeStart + _0x8057[1503] + iframeEnd);
                            $(n)[_0x8057[508]](html)[_0x8057[331]]();
                        };
                    };
                };
                if (convertImageLinks && html && html[_0x8057[647]](urlImage)) {
                    html = html[_0x8057[541]](urlImage, _0x8057[1504]);
                    $(n)[_0x8057[508]](html)[_0x8057[331]]();
                    return;
                };
                if (html[_0x8057[10]](/\$/g) != -1) {
                    html = html[_0x8057[541]](/\$/g, _0x8057[542]);
                };
                var matches = html[_0x8057[647]](regex);
                if (convertUrlLinks && html && matches) {
                    var len = matches[_0x8057[21]];
                    for (var z = 0; z < len; z++) {
                        if (matches[z][_0x8057[647]](/\.$/) !== null) {
                            matches[z] = matches[z][_0x8057[541]](/\.$/, _0x8057[255]);
                        };
                        var href = matches[z];
                        var text = href;
                        var space = _0x8057[255];
                        if (href[_0x8057[647]](/\s$/) !== null) {
                            space = _0x8057[553];
                        };
                        var addProtocol = protocol + _0x8057[813];
                        if (href[_0x8057[647]](rProtocol) !== null) {
                            addProtocol = _0x8057[255];
                        };
                        if (text[_0x8057[21]] > linkSize) {
                            text = text[_0x8057[713]](0, linkSize) + _0x8057[1169];
                        };
                        text = text[_0x8057[541]](/&#36;/g, _0x8057[1309])[_0x8057[541]](/&/g, _0x8057[665])[_0x8057[541]](/</g, _0x8057[664])[_0x8057[541]](/>/g, _0x8057[663]);
                        html = html[_0x8057[541]](href, _0x8057[760] + addProtocol + $[_0x8057[390]](href) + _0x8057[730] + $[_0x8057[390]](text) + _0x8057[731] + space);
                    };
                    $(n)[_0x8057[508]](html)[_0x8057[331]]();
                };
            } else {
                if (n[_0x8057[769]] === 1 && !/^(pre|a|button|textarea)$/i [_0x8057[604]](n[_0x8057[311]])) {
                    $[_0x8057[23]][_0x8057[5]][_0x8057[1008]][_0x8057[6]](n, protocol, convertLinks, convertUrlLinks, convertImageLinks, convertVideoLinks, linkSize);
                };
            };
        };
    };
})(jQuery);