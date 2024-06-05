"use strict";

var matrixChartModule = (function () {
    var matrix_chart;
    var matrix_added_affiliations_ids = new Set();
    var matrix_removed_affiliations_ids = new Set();

    function GraphD3(_mainSelector, _data, _affiliations, _xAxisText, _yAxisText) {
        this.mainSelector = _mainSelector
        this.dataJson = _data
        this.affiliations_to_draw = _affiliations
        this.xAxisText = _xAxisText
        this.yAxisText = _yAxisText
        //--
        this.SHOW_D3_AXIS = false
        //--
        this.emitter = new Emisor()
        this.x_panel
        this.y_panel
        this.orgLines
        this.orgFiles
        //--
        this.selectedOrg = null
        this.mouseoverOrg = null
        //--
        this.grafica_width = 420
        this.grafica_height = 420
        //--
        this.svg
        this.svg_greyBg
        this.svg_graph
        this.svg_graph_bg
        this.svg_graph_dots
        //--
        this.data = new Datos()
        this.data_d3
        this.x_keys = []
        this.x_keys_text = []
        this.y_keys = []
        this.y_keys_text = []
        //--
        this.x_active_min = Number.POSITIVE_INFINITY
        this.x_active_max = 0
        this.y_active_min = Number.POSITIVE_INFINITY
        this.y_active_max = 0
        this.x_abs_min = Number.POSITIVE_INFINITY
        this.x_abs_max = 0
        this.y_abs_min = Number.POSITIVE_INFINITY
        this.y_abs_max = 0
        //--
        //--
        this.switchs_instances = {}
        //--
        this.create_svg_structure()
        //--
        var that = this
        that.onDataLoaded(this.dataJson)
    }

    // PUBLICAS:
    GraphD3.prototype.testScope = function () {
        console.log("(GraphD3.testScope): ")
    }
    //-------------------------
    // PRIVADAS:
    GraphD3.prototype.init = function (jsonData) {
        this.create_data(jsonData); // Parse data into a "Datos" structure
        this.update_data(); // Totals, max and mins ares recalculated acording to its active propertie
        this.create_panel_y();
        this.create_panel_x();
        this.create_affiliations_panel();
        this.create_lines();
        this.create_files();
        this.initialize_switches();
        this.draw_data();
    }

    GraphD3.prototype.create_files = function () {
        let htmlString = "";

        htmlString += '<div id="files" class="">'
        htmlString += '</div>'

        $(this.mainSelector).append(htmlString)
        $(this.mainSelector + " #files").css({
            position: "absolute"
        })
        //--
        this.orgFiles = new FileManager(this.mainSelector + " #files", this)
        $(this.mainSelector + " #files").css({
            position: "absolute"
        })
    }

    GraphD3.prototype.create_lines = function () {
        let htmlString = "";

        htmlString += '<div id="lines" class="">'
        htmlString += '<div id="selected_lines" class="">'
        htmlString += '</div>'
        htmlString += '</div>'
        $(this.mainSelector).append(htmlString)
        $(this.mainSelector + " #selected_lines").css({
            position: "absolute",
            top: "105px",
            left: "66px"
        })
        //--
        this.x_axis_line = new PolylineaCSS("x_axis_line", this.mainSelector + " #lines", true, "#4ec0a7")
        this.x_axis_line.nuevoTramo({x: 563, y: 553}, {x: 563, y: 586})
        this.x_axis_line.nuevoTramo({x: 563, y: 586}, {x: 951, y: 586})
        this.x_axis_line.init()
        //--
        this.y_axis_line = new PolylineaCSS("y_axis_line", this.mainSelector + " #lines", true, "#4ec0a7")
        this.y_axis_line.nuevoTramo({x: 405, y: 425}, {x: 385, y: 425})
        this.y_axis_line.nuevoTramo({x: 384, y: 425}, {x: 384, y: 26})
        this.y_axis_line.nuevoTramo({x: 383, y: 26}, {x: 965, y: 26})
        this.y_axis_line.init()
        //--
        this.orgLines = new OrgLines(this.mainSelector + " #selected_lines", this)
    }

    GraphD3.prototype.create_affiliations_panel = function () {
        let htmlString = "";
        htmlString += '<div class="matrix-chart-organizations-container">';
        htmlString += '<div class="affiliations-header">';
        htmlString += "Organizations";
        htmlString += '</div>';
        htmlString += '<div class="affiliations-content">';
        htmlString += '</div>';
        htmlString += '</div>';
        $(this.mainSelector).append(htmlString);

        Array.prototype.forEach.call(this.affiliations_to_draw, affiliation => {
            htmlString = "";
            htmlString += '<div id="' + affiliation["slug"] + '_matrix_id" class="matrix-chart-organizations-entrance">';

            htmlString += '<div class="matrix-chart-organizations-picture-container affiliation-picture" style="width: 10%;">';
            htmlString += '<img class="matrix-chart-organizations-picture" src="' + affiliation["picture"] + '" alt="">';
            htmlString += '</div>';
            htmlString += '<div class="matrix-chart-organizations-name affiliation-name" style="width: 80%;">';
            htmlString += '<a class="lkn-tx-corp th-corp2 text-tam14 dots-limit-lines dots-limit-1-line" style="word-break: break-all; cursor:pointer; padding-right: 5px; font-family: Asap; font-size: 14px; font-weight: 600;">';
            htmlString += affiliation["name"];
            htmlString += '</a>';
            htmlString += '</div>';
            htmlString += '<div class="affiliation-close" style="width: 10%;">';
            htmlString += '<span class="fas fa-times lkn-tx-corp th-corp2 text-tam14 dots-limit-lines dots-limit-1-line" style="cursor: pointer;">';
            htmlString += '</span>';
            htmlString += '</div>';
            htmlString += '</div>';

            $(this.mainSelector + " .affiliations-content").append(htmlString);
            $(this.mainSelector + " .affiliations-content> #" +  affiliation["slug"] + "_matrix_id> .affiliation-name> a").on("click", function() {
                _open_affiliation_data_in_matrix_chart(affiliation["name"]);
            });

            let affiliation_slug_parts = affiliation['slug'].split("-");
            let affiliation_id = parseInt(affiliation_slug_parts[affiliation_slug_parts.length - 1]);
            $(this.mainSelector + " .affiliations-content> #" +  affiliation["slug"] + "_matrix_id> .affiliation-close> span").on("click", function() {
                _remove_affiliation_from_matrix_chart(affiliation["slug"] + "_matrix_id", affiliation_id, affiliation["name"]);
            });
        })
    }

    GraphD3.prototype.create_panel_y = function () {
        let htmlString = "";

        htmlString += '<div id="panel_y" class="axis_panel bg_dev">'
        htmlString += '<div class="header bg_dev">'
        htmlString += this.yAxisText
        htmlString += '<div class="panel_svg_icon">'
        htmlString += '<svg> <g id="XMLID_11_"> <line id="XMLID_10_" fill="none" stroke="#83d3c1" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="4" y1="15" x2="17" y2="15"/> <line id="XMLID_9_" fill="none" stroke="#83d3c1" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="15" y1="13" x2="17" y2="15"/> <line id="XMLID_5_" fill="none" stroke="#83d3c1" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="15" y1="17" x2="17" y2="15"/> </g> <g id="XMLID_4_"> <line id="XMLID_8_" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="4" y1="15" x2="4" y2="2"/> <line id="XMLID_7_" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="2" y1="4" x2="4" y2="2"/> <line id="XMLID_6_" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="6" y1="4" x2="4" y2="2"/> </g> </g> </svg>'
        htmlString += '</div>'
        htmlString += '</div>'
        htmlString += '<div class="content_msk">'
        htmlString += '<div class="content"></div>'
        htmlString += '</div>'
        htmlString += '</div>'
        $(this.mainSelector).append(htmlString)
        //--
        htmlString = ""
        let totalHeight = 5;
        let incrAcumulada = 22;

        for (let i = 0; i < this.y_keys.length; i++) {
            let key = this.y_keys[i];
            let posY = totalHeight;

            totalHeight = totalHeight + (incrAcumulada)
            htmlString += '<div id="y_key_switch_' + i + '" class="key_switch_cont" style="top:' + posY + 'px">'
            htmlString += '<div class="key_switch_text">' + this.y_keys_text[i] + '</div>'
            htmlString += '<div class="switch_gui">'
            htmlString += '<div class="switch_gui_bg">'
            htmlString += '<div class="switch_gui_fg"></div>'
            htmlString += '</div>'
            htmlString += '</div>'
            htmlString += '</div>'
            //--
            let switch_selector = this.mainSelector + " #panel_y #y_key_switch_" + i + " .switch_gui"
            let switch_id = key
            this.switchs_instances[switch_id] = new GUI_Swicth(switch_selector, switch_id)
            this.switchs_instances[switch_id].emisor.addEventListener("onActivatedSwitch", this.onActivatedSwitch, this)
            this.switchs_instances[switch_id].emisor.addEventListener("onDeactivatedSwitch", this.onDeactivatedSwitch, this)
        }
        totalHeight += 15
        $(this.mainSelector + " #panel_y .content").append(htmlString)
        $(this.mainSelector + " #panel_y .content").height(totalHeight)
        $(this.mainSelector + " #panel_y .content_msk").height(totalHeight)
        //--
        this.y_panel = new Axis_Panel(this.mainSelector + " #panel_y", "y", totalHeight, this)
    }
    GraphD3.prototype.create_panel_x = function () {
        let htmlString = "";

        htmlString += '<div id="panel_x" class="axis_panel bg_dev">'
        htmlString += '<div class="header bg_dev">'
        htmlString += this.xAxisText
        htmlString += '<div class="panel_svg_icon">'
        htmlString += '<svg> <g id="XMLID_4_"> <line id="XMLID_8_" fill="none" stroke="#83d3c1" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="4" y1="15" x2="4" y2="2"/> <line id="XMLID_7_" fill="none" stroke="#83d3c1" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="2" y1="4" x2="4" y2="2"/> <line id="XMLID_6_" fill="none" stroke="#83d3c1" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="6" y1="4" x2="4" y2="2"/> </g> <g id="XMLID_11_"> <line id="XMLID_10_" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="4" y1="15" x2="17" y2="15"/> <line id="XMLID_9_" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="15" y1="13" x2="17" y2="15"/> <line id="XMLID_5_" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-miterlimit="10" x1="15" y1="17" x2="17" y2="15"/> </g> </svg>'
        htmlString += '</div>'
        htmlString += '</div>'
        htmlString += '<div class="content_msk">'
        htmlString += '<div class="content"></div>'
        htmlString += '</div>'
        htmlString += '</div>'
        $(this.mainSelector).append(htmlString)
        //--
        htmlString = "";
        let totalHeight = 15;
        let incrAcumulada = 22;

        for (let i = 0; i < this.x_keys.length; i++) {
            let key = this.x_keys[i];
            let posY = totalHeight;

            totalHeight = totalHeight + (incrAcumulada)
            htmlString += '<div id="x_key_switch_' + i + '" class="key_switch_cont" style="top:' + posY + 'px">'
            htmlString += '<div class="key_switch_text">' + this.x_keys_text[i] + '</div>'
            htmlString += '<div class="switch_gui">'
            htmlString += '<div class="switch_gui_bg">'
            htmlString += '<div class="switch_gui_fg"></div>'
            htmlString += '</div>'
            htmlString += '</div>'
            htmlString += '</div>'
            //--
            let switch_selector = this.mainSelector + " #panel_x #x_key_switch_" + i + " .switch_gui"
            let switch_id = key

            this.switchs_instances[switch_id] = new GUI_Swicth(switch_selector, switch_id)
            this.switchs_instances[switch_id].emisor.addEventListener("onActivatedSwitch", this.onActivatedSwitch, this)
            this.switchs_instances[switch_id].emisor.addEventListener("onDeactivatedSwitch", this.onDeactivatedSwitch, this)
        }
        totalHeight += 5
        $(this.mainSelector + " #panel_x .content").append(htmlString)
        $(this.mainSelector + " #panel_x .content").height(totalHeight)
        $(this.mainSelector + " #panel_x .content").css({
            height: totalHeight,
        })
        $(this.mainSelector + " #panel_x .content_msk").css({
            height: totalHeight,
            top: -totalHeight - 22
        })
        //--
        this.x_panel = new Axis_Panel(this.mainSelector + " #panel_x", "x", totalHeight, this)
    }
    GraphD3.prototype.initialize_switches = function () {
        // Switchs initialized once instanciated
        for (let switch_name in this.switchs_instances) {
            this.switchs_instances[switch_name].init()
        }
    }
    GraphD3.prototype.update_data = function () {
        this.x_active_min = Number.POSITIVE_INFINITY
        this.x_active_max = 0
        this.y_active_min = Number.POSITIVE_INFINITY
        this.y_active_max = 0
        this.x_abs_min = Number.POSITIVE_INFINITY
        this.x_abs_max = 0
        this.y_abs_min = Number.POSITIVE_INFINITY
        this.y_abs_max = 0
        for (let i = 0; i < this.data.arrayItems.length; i++) {
            let orgId = this.data.arrayItems[i];
            let org = this.data.getItem(orgId);

            org.x_abs_total = 0 // The total x score result of adding ALL keys
            org.y_abs_total = 0 // The total x score result of adding ALL keys
            org.x_active_total = 0 // The total x score result of adding all ACTIVE keys
            org.x_key_active_max = 0 // Highest x value of a key
            org.x_key_active_min = Number.POSITIVE_INFINITY
            org.y_active_total = 0 // The total x score result of adding all ACTIVE keys
            org.y_key_active_max = 0// Highest y value of a key
            org.y_key_active_min = Number.POSITIVE_INFINITY
            for (let j = 0; j < org.keys.arrayItems.length; j++) {
                let keyId = org.keys.arrayItems[j]
                let key = org.keys.getItem(keyId)

                if (key.axis.toLowerCase() === "x") {
                    org.x_abs_total += Number(key.value)
                } else if (key.axis.toLowerCase() === "y") {
                    org.y_abs_total += Number(key.value)
                }
                if (key.active) {
                    if (key.axis.toLowerCase() === "x") {
                        org.x_active_total += Number(key.value)
                        if (key.value > org.x_key_active_max) {
                            org.x_key_active_max = key.value
                        }
                        if (key.value < org.x_key_active_min) {
                            org.x_key_active_min = key.value
                        }
                    } else if (key.axis.toLowerCase() === "y") {
                        org.y_active_total += Number(key.value)
                        if (key.value > org.y_key_active_max) {
                            org.y_key_active_max = key.value
                        }
                        if (key.value < org.y_key_active_min) {
                            org.y_key_active_min = key.value
                        }
                    }
                }
            }
            if (org.x_abs_total > this.x_abs_max) {
                this.x_abs_max = org.x_abs_total
            }
            if (org.y_abs_total > this.y_abs_max) {
                this.y_abs_max = org.y_abs_total
            }
            //--
            if (org.x_active_total > this.x_active_max) {
                this.x_active_max = org.x_active_total
            }
            if (org.x_active_total < this.x_active_min) {
                this.x_active_min = org.x_active_total
            }
            if (org.y_active_total > this.y_active_max) {
                this.y_active_max = org.y_active_total
            }
            if (org.y_active_total < this.y_active_min) {
                this.y_active_min = org.y_active_total
            }
        }
        ///--
        this.data_d3 = []

        for (let i = 0; i < this.data.arrayItems.length; i++) {
            let orgId = this.data.arrayItems[i]
            let org = this.data.getItem(orgId)
            let orgObj = {}

            orgObj.name = org.name
            orgObj.orgId = org.orgId
            orgObj.x_active_total = org.x_active_total
            orgObj.y_active_total = org.y_active_total
            this.data_d3.push(orgObj)
        }
    }

    GraphD3.prototype.create_data = function (data) {
        for (let i in data) {
            let org_rawData = data[i];
            let org = {}

            org.orgId = "org_" + i
            org.name = org_rawData.organization.name
            org.alias = new Datos()
            org.keys = new Datos()
            org.x_active_total = 0
            org.x_key_active_max = 0
            org.x_key_active_min = Number.POSITIVE_INFINITY
            org.y_active_total = 0
            org.y_key_active_max = 0
            org.y_key_active_min = Number.POSITIVE_INFINITY
            //--
            this.data.nuevoItem(org.orgId, org)
            //--
            if (org_rawData.organization.alias) {
                let aliasCouter = 0
                for (let k in org_rawData.organization.alias) {
                    let rawAlias = org_rawData.organization.alias[k]
                    let aliasItem = {}
                    aliasItem.aliasId = "alias_" + aliasCouter
                    aliasItem.name = rawAlias.name
                    aliasItem.logo = rawAlias.logo
                    org.alias.nuevoItem(aliasItem.aliasId, aliasItem)
                    aliasCouter++
                }
            }
            //--
            for (var j in org_rawData.data) {
                var key_rawData = org_rawData.data[j]
                var key = {}
                key.keyId = key_rawData.id
                key.axis = key_rawData.axis
                key.text = key_rawData.text
                this.eval_newKey(key.axis, key.keyId, key.text)
                key.mod = key_rawData.mod
                key.realValue = key_rawData.value
                key.value = key_rawData.value * key.mod
                key.active = true
                key.meta = new Datos()

                for (var k in key_rawData.metadata) {
                    var subkey_rawData = key_rawData.metadata[k]
                    var subkey = {}
                    subkey.subkeyId = "subkey_" + k
                    subkey.text = subkey_rawData.text
                    subkey.value = subkey_rawData.value
                    key.meta.nuevoItem(subkey.subkeyId, subkey)
                }
                org.keys.nuevoItem(key.keyId, key)
            }

            this.data.nuevoItem(org.orgId, org)
        }

    }
    GraphD3.prototype.eval_newKey = function (axis, keyId, text) {
        if (axis.toLowerCase() === "x") {
            if (this.x_keys.indexOf(keyId) === -1) {
                this.x_keys.push(keyId)
                this.x_keys_text.push(text)
            }
        } else if (axis.toLowerCase() === "y") {
            if (this.y_keys.indexOf(keyId) === -1) {
                this.y_keys.push(keyId)
                this.y_keys_text.push(text)
            }
        }
    }

    GraphD3.prototype.create_svg_structure = function () {
        this.svg = d3.select(this.mainSelector)
            .append("svg")
            .attr("class", "graphD3_svg")
            .attr("width", 472)
            .attr("height", 472)

        // Creamos el fondo gris redondeado
        this.svg_greyBg = this.svg.append("g")
            .attr("id", "graphD3_greyBg")

        this.svg_greyBg_rect = this.svg_greyBg.append("rect")
            .attr("style", "fill:#e5e5e5")    // fill color of shape
            .attr("x", 0)                                // displacement from origin
            .attr("y", 0)                                // displacement from origin
            .attr("rx", 20)                                // how much to round corners - to be transitioned below
            .attr("ry", 20)                                // how much to round corners - to be transitioned below
            .attr("width", 472)                        // size of shape
            .attr("height", 472);					// size of shape

        this.svg_x_text = this.svg_greyBg.append("g")
            .attr("id", "svg_x_axis_text_g")
            .attr("transform", "translate(80, 465)")
            .attr("y", 465)
        this.svg_x_text_text = this.svg_x_text.append("text")
            .attr("id", "svg_x_axis_text")
            .attr("class", "svg_axis_text")
            .attr("fill", "#4ec0a7")
            .text(this.xAxisText);

        this.svg_x_axis_icon_g = this.svg_x_text.append("g")
            .attr("id", "svg_x_axis_icon_g")
            .attr("transform", "translate(0, 0)")
        this.svg_x_axis_icon_g.append("line")
            .attr("stroke", "#ACACAC")
            .attr("stroke-linecap", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-miterlimit", "10")
            .attr("x1", "2")
            .attr("y1", "5")
            .attr("x2", "62")
            .attr("y2", "5")
        this.svg_x_axis_icon_g.append("line")
            .attr("stroke", "#ACACAC")
            .attr("stroke-linecap", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-miterlimit", "10")
            .attr("x1", "59")
            .attr("y1", "2")
            .attr("x2", "62")
            .attr("y2", "5")
        this.svg_x_axis_icon_g.append("line")
            .attr("stroke", "#ACACAC")
            .attr("stroke-linecap", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-miterlimit", "10")
            .attr("x1", "59")
            .attr("y1", "8")
            .attr("x2", "62")
            .attr("y2", "5")


        this.svg_y_text = this.svg_greyBg.append("g")
            .attr("id", "svg_y_axis_translate_g")
            .attr("transform", "translate(20, 390)")
        this.svg_y_text_rotate_g = this.svg_y_text.append("g")
            .attr("id", "svg_y_axis_rotate_g")
            .attr("transform", "rotate(270)")
        this.svg_y_text_text = this.svg_y_text_rotate_g.append("text")
            .attr("id", "svg_y_axis_text")
            .attr("class", "svg_axis_text")
            .attr("fill", "#4ec0a7")
            .text(this.yAxisText)

        this.svg_y_axis_icon_g = this.svg_y_text_rotate_g.append("g")
            .attr("id", "svg_y_axis_icon_g")
            .attr("transform", "translate(0, 0)")
        this.svg_y_axis_icon_g.append("line")
            .attr("stroke", "#ACACAC")
            .attr("stroke-linecap", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-miterlimit", "10")
            .attr("x1", "2")
            .attr("y1", "5")
            .attr("x2", "62")
            .attr("y2", "5")
        this.svg_y_axis_icon_g.append("line")
            .attr("stroke", "#ACACAC")
            .attr("stroke-linecap", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-miterlimit", "10")
            .attr("x1", "59")
            .attr("y1", "2")
            .attr("x2", "62")
            .attr("y2", "5")
        this.svg_y_axis_icon_g.append("line")
            .attr("stroke", "#ACACAC")
            .attr("stroke-linecap", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-miterlimit", "10")
            .attr("x1", "59")
            .attr("y1", "8")
            .attr("x2", "62")
            .attr("y2", "5")

        // Creamos el degradado del fondo como def del svg
        this.svg_defs = this.svg.append('defs')
            .append('linearGradient')
            .attr('id', 'grad')
            .attr('x1', '0%')
            .attr('y1', '100%')
            .attr('x2', '100%')
            .attr('y2', '0%')
            .attr('gradientTransform', 'rotate(0)')
        var stop1 = this.svg_defs.append("stop")
            .attr('offset', '0%')
            .attr('style', 'stop-color:rgb(235,108,93);stop-opacity:1')
        var stop2 = this.svg_defs.append("stop")
            .attr('offset', '50%')
            .attr('style', 'stop-color:rgb(210,184,38);stop-opacity:1')
        var stop3 = this.svg_defs.append("stop")
            .attr('offset', '100%')
            .attr('style', 'stop-color:rgb(85,190,155);stop-opacity:1')

        // Creamos el g de la grafica
        this.svg_graph = this.svg.append("g")
            .attr("id", "graphD3_graph")
            .attr("transform", "translate(" + 26 + "," + 26 + ")")

        // Grey backgroung created
        this.svg_graph_bg = this.svg_graph.append("rect")
            .attr("id", "graphD3_graph_bg")
            .attr("style", "fill:url(#grad)")    // fill color of shape
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.grafica_width)
            .attr("height", this.grafica_height);

        // Dot holder created
        this.svg_graph_dots = this.svg_graph.append("g")
            .attr("id", "graph_dots")
            .attr("transform", "translate(" + 20 + "," + 20 + ")")


        //--
        var x_axis_text_width = $(this.mainSelector + " #svg_x_axis_text")[0].getBoundingClientRect().width;
        $(this.mainSelector + " #svg_x_axis_icon_g").attr({
            transform: "translate(120, -10)"
        })
        var y_axis_text_width = $(this.mainSelector + " #svg_x_axis_text")[0].getBoundingClientRect().width;
        $(this.mainSelector + " #svg_y_axis_icon_g").attr({
            transform: "translate(120, -10)"
        })

    }

    GraphD3.prototype.draw_data = function () {
        // Add X axis
        var graph_size = 380
        var x_domain_max = this.x_active_max
        if (x_domain_max < 10) {
            x_domain_max = 10
        }
        var y_domain_max = this.y_active_max
        if (y_domain_max < 10) {
            y_domain_max = 10
        }
        var x = d3.scaleLinear()
            .domain([0, x_domain_max])
            .range([0, graph_size])

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, y_domain_max])
            .range([graph_size, 0])


        if (this.SHOW_D3_AXIS) {
            this.svg_x_axis = this.svg_graph.append("g")
                .attr("transform", "translate(20," + 400 + ")")
                .call(d3.axisBottom(x));
            this.svg_y_axis = this.svg_graph.append("g")
                .attr("transform", "translate(20," + 20 + ")")
                .call(d3.axisLeft(y));
        }
        // Add dots
        this.svg_graph_dots.append('g')
            .selectAll()
            .data(this.data_d3)
            .enter()
            .append("circle")
            .attr("id", function (d) {
                return d.orgId
            })
            .attr("class", "hand_cursor")
            .attr("cx", 0)
            .attr("cy", graph_size)
            .attr("r", 0)
            .style("fill", "#ffffff")
            .style("stroke", "#cccccc")
            .style("stroke-width", "1")
            .transition()
            .duration(500)
            .attr("cx", function (d) {
                return x(d.x_active_total);
            })
            .attr("cy", function (d) {
                return y(d.y_active_total);
            })
            .attr("r", 10)
            .style("fill", "#ffffff")

        this.svg_graph_dots.append('g')
            .selectAll()
            .data(this.data_d3)
            .enter()
            .append("text")
            .attr("id", function (d) {
                return "svg_txt_" + d.orgId
            })
            .text(function (d) {
                return d.name;
            })
            .attr("class", "svg_cir_name")
            .attr("text-anchor", "middle")
            .attr("x", 0)
            .attr("y", graph_size)
            .attr("opacity", 0)
            .style("fill", "#ffffff")
            .transition()
            .duration(500)
            .attr("x", function (d) {
                return x(d.x_active_total);
            })
            .attr("y", function (d) {
                return y(d.y_active_total) + 22;
            })
            .attr("opacity", 0.5)


        var that = this
        this.svg_graph_dots.selectAll("circle").on("click", function (e) {
            that.onItem_click(e)
        })
        this.svg_graph_dots.selectAll("circle").on("mouseover", function (e) {
            that.onItem_mouseover(e)
        })
        this.svg_graph_dots.selectAll("circle").on("mouseout", function (e) {
            that.onItem_mouseout(e)
        })


    }


    GraphD3.prototype.update_graph_view = function () {
        let graph_size = 380
        let margen = 0.0
        let x_domain_max = this.x_active_max
        if (x_domain_max < 10) {
            x_domain_max = 10
        }
        let y_domain_max = this.y_active_max
        if (y_domain_max < 10) {
            y_domain_max = 10
        }
        let x = d3.scaleLinear()
            .domain([0, x_domain_max])
            .range([0, graph_size])

        // Add Y axis
        let y = d3.scaleLinear()
            .domain([0, y_domain_max])
            .range([graph_size, 0])

        if (this.SHOW_D3_AXIS) {
            this.svg_x_axis.transition()
                .duration(500)
                .call(d3.axisBottom(x));
            this.svg_y_axis.transition()
                .duration(500)
                .call(d3.axisLeft(y));
        }
        let dot = this.svg_graph_dots.selectAll("circle")
            .data(this.data_d3)
        dot.exit().remove();
        dot.enter().append("circle")
        dot.transition()
            .duration(500)
            .attr("cx", function (d) {
                return x(d.x_active_total);
            })
            .attr("cy", function (d) {
                return y(d.y_active_total);
            })

        let text = this.svg_graph_dots.selectAll("text")
            .data(this.data_d3)

        text.exit().remove();
        text.enter().append("text")
        text.transition()
            .duration(500)
            .attr("opacity", 0.5)
            .attr("x", function (d) {
                return x(d.x_active_total);
            })
            .attr("y", function (d) {
                return y(d.y_active_total) + 22;
            })
    }

    GraphD3.prototype.setKeyActive = function (_keyId, boolValue) {
        for (let i = 0; i < this.data.arrayItems.length; i++) {
            let orgId = this.data.arrayItems[i]
            let org = this.data.getItem(orgId)

            for (let j = 0; j < org.keys.arrayItems.length; j++) {
                let keyId = org.keys.arrayItems[j]
                let key = org.keys.getItem(keyId)

                if (key.keyId === _keyId) {
                    key.active = boolValue
                }
            }
        }
    }

    GraphD3.prototype.paintState = function () {
        for (let i = 0; i < this.data.arrayItems.length; i++) {
            let tempId = this.data.arrayItems[i]
            let selector = this.mainSelector + " #svg_txt_" + tempId

            if (this.selectedOrg == null && this.mouseoverOrg == null) {
                TweenMax.to(selector, 0.2, {
                    fill: "#ffffff",
                    opacity: 0.5
                })
            } else if (tempId === this.selectedOrg) {
                TweenMax.to(selector, 0.2, {
                    fill: "#000000",
                    opacity: 1
                })
            } else {
                if (tempId === this.mouseoverOrg) {
                    TweenMax.to(selector, 0.1, {
                        fill: "#000000",
                        opacity: 0.8
                    })
                } else {
                    TweenMax.to(selector, 0.2, {
                        fill: "#ffffff",
                        opacity: 0.2
                    })
                }
            }
        }

    }
    //-------------------------
    // EVENTOS:
    GraphD3.prototype.onActivatedSwitch = function (evento) {
        this.setKeyActive(evento.switchId, true)
        this.update_data()
        this.update_graph_view()
    }
    GraphD3.prototype.onDeactivatedSwitch = function (evento) {
        this.setKeyActive(evento.switchId, false)
        this.update_data()
        this.update_graph_view()
    }
    GraphD3.prototype.onDataLoaded = function (jsonData) {
        this.init(jsonData)
    }
    GraphD3.prototype.onItem_mouseout = function (evento) {
        this.mouseoverOrg = null
        this.paintState()
    }
    GraphD3.prototype.onItem_mouseover = function (evento) {
        this.mouseoverOrg = evento.currentTarget.id
        this.paintState()
    }
    GraphD3.prototype.onItem_click = function (evento) {
        this.selectItem(evento.currentTarget.id, evento.currentTarget.cx.animVal.value, evento.currentTarget.cy.animVal.value)
    }
    GraphD3.prototype.selectItem = function (itemId, x, y) {
        if (itemId !== this.selectedOrg) {
            if (this.selectedOrg == null) {
                // No org is selected.
                this.selectedOrg = itemId
                this.selectOrg(this.selectedOrg, x, y, false, 0)
            } else {
                // Another org is selected. We give a pit of time so it can hide first
                this.selectedOrg = itemId
                this.selectOrg(null, null, null, false, 0)
                this.selectOrg(this.selectedOrg, x, y, false, 0.5)
            }
        } else {
            // The same is org is already selected. We deselect it.
            this.selectedOrg = null
            this.selectOrg(this.selectedOrg, null, null, true, 0)
        }
        this.paintState()
    }
    GraphD3.prototype.selectOrg = function (orgId, x, y, openPannels, pause) {
        pause = pause || 0
        if (pause === 0) {
            this.emitter.emitir("onOrgSelected", {orgId: orgId, x: x, y: y, openPannels: openPannels})
        } else {
            TweenMax.delayedCall(pause, this.selectOrg, [orgId, x, y, openPannels, 0], this)
        }
    }
    GraphD3.prototype.deselectOrg = function (orgId, pause) {
        pause = pause || 0
        if (pause === 0) {
            this.emitter.emitir("onOrgDeselected", {orgId: orgId})
        } else {
            TweenMax.delayedCall(pause, this.selectOrg, [orgId, 0], this)
        }
    }


    /* CLASE GraphD3 */

    /*-------------------------------------*/

    function FileManager(_selector, _graphD3_ref) {
        this.selector = _selector
        this.graphD3_ref = _graphD3_ref
        //--
        this.selectedOrg = null
        this.selectedFileId = null
        this.counter = 0
        this.fileId = null
        this.files = {}
        //--
        this.graphD3_ref.emitter.addEventListener("onCreateFile", this.onCreateFile, this)
        this.graphD3_ref.emitter.addEventListener("onOrgSelected", this.onOrgSelected, this)
    }

    FileManager.prototype.createFile = function (orgId) {
        this.selectedOrg = orgId
        this.selectedFileId = "file_" + this.counter
        this.counter++
        var data = this.graphD3_ref.data.getItem(orgId)
        this.files[this.selectedFileId] = new FileItem(this, this.selector, this.selectedFileId, this.selectedOrg, data)
        //--

    }
    FileManager.prototype.eval_removeFile = function () {
        if (this.selectedFileId != null) {
            this.files[this.selectedFileId].close()
            this.selectedFileId = null
        }
    }

    FileManager.prototype.onOrgSelected = function (event) {
        if (event.orgId !== this.selectedOrg) {
            this.eval_removeFile()
        }
    }

    FileManager.prototype.onCreateFile = function (event) {
        if (event.orgId == null) {
            this.selectedOrg = null
            this.eval_removeFile()
        } else {
            this.eval_removeFile()
            this.createFile(event.orgId)
        }
    }

    function FileItem(_fileManagerRef, _selector, _fileId, _orgId, _orgData) {
        this.fileManagerRef = _fileManagerRef
        this.selector = _selector
        this.fileId = _fileId
        this.orgId = _orgId
        this.data = _orgData
        //--
        this.fileSelector = this.selector + " #" + this.fileId
        this.totalHeight = 5
        //--
        this.open()
    }

    FileItem.prototype.open = function () {
        let htmlString = ""
        htmlString += '<div id="' + this.fileId + '" class="file_item">'
        htmlString += '<div class="file_header hand_cursor">'
        htmlString += this.data.name.length <= 25 ? this.data.name : this.data.name.substring(0, 22) + "..."
        htmlString += '<div class="file_header_closeBt">'
        htmlString += '<svg>'
        htmlString += '<g id="closeBt">'
        htmlString += '<line x1="2" y1="2" x2="10" y2="10" style="fill:none;stroke:#FFFFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;"/>'
        htmlString += '<line x1="10" y1="2" x2="2" y2="10" style="fill:none;stroke:#FFFFFF;stroke-width:2;stroke-linecap:round;stroke-miterlimit:10;"/>'
        htmlString += '</g>'
        htmlString += '<//svg>'
        htmlString += '</div>'
        htmlString += '</div>'
        htmlString += '<div class="file_content_msk">'
        htmlString += '<div class="file_content">'
        htmlString += '<div class="alias_content"></div>'
        htmlString += '<div class="keys_content"></div>'
        htmlString += '</div>'
        htmlString += '</div>'
        htmlString += '</div>'
        $(this.selector).append(htmlString)
        //--
        this.totalHeight += this.create_alias()
        this.totalHeight += this.create_keys()
        this.totalHeight += 0

        //--
        $(this.fileSelector + " .file_content").css({
            top: -this.totalHeight + "px",
            height: this.totalHeight + "px",
        })
        //--
        TweenMax.to(this.fileSelector, 0.2, {
            left: "941px"
        })
        TweenMax.to(this.fileSelector + " .file_header", 0.2, {
            width: "260px",
            onComplete: this.onHeaderShown,
            onCompleteScope: this
        })
        //--
        let that = this
        $(this.selector + " #" + this.fileId + " .file_header").click(function () {
            that.fileManagerRef.graphD3_ref.selectItem(that.orgId, 0, 0);
        })
    }
    FileItem.prototype.create_alias = function () {
        if (this.data.alias.arrayItems.length > 0) {
            let alias_content_height = 5 + 5 + 1; // Margin-top + hr margin-top + hr height
            let aliasItemHeight = 22;

            for (let i in this.data.alias.arrayItems) {
                let aliasId = this.data.alias.arrayItems[i];
                let aliasData = this.data.alias.getItem(aliasId);
                let htmlString = "";

                htmlString += '<div id="' + aliasId + '" class="alias_item _bg_dev" style="height:' + aliasItemHeight + 'px;">'
                htmlString += aliasData.name.length <= 25 ? aliasData.name : aliasData.name.substring(0, 22) + "..."
                if (aliasData.logo !== "") {
                    htmlString += '<div class="alias_logo"><img src="' + aliasData.logo + '"></div>'
                }
                htmlString += '</div>'
                alias_content_height += aliasItemHeight
                $(this.selector + " .alias_content").append(htmlString)
            }
            $(this.selector + " .alias_content").append("<hr style='margin-top:5px;'>")
            //--
            return alias_content_height
        } else {
            return 0
        }
    }
    FileItem.prototype.create_keys = function () {
        let keys_content_height = 5 // Margin-top + hr margin-top + hr height
        let keyItemHeight = 21
        let keyItemHeight_woHr = keyItemHeight - 2
        let filteredArray_x = []
        let filteredArray_y = []

        for (let i = 0; i < this.data.keys.arrayItems.length; i++) {
            let keyId = this.data.keys.arrayItems[i]
            let keyData = this.data.keys.getItem(keyId)

            if (keyData.axis === "x") {
                filteredArray_x.push(keyId)
            } else if (keyData.axis === "y") {
                filteredArray_y.push(keyId)
            }
        }

        var htmlString = ""
        htmlString += '<div class="key_axis_header _bg_dev" style="width:100%; height:22px;">'
        htmlString += this.fileManagerRef.graphD3_ref.yAxisText
        htmlString += '</div>'
        htmlString += '<hr>'
        $(this.selector + " .keys_content").append(htmlString)
        keys_content_height += 22

        for (let i = 0; i < filteredArray_y.length; i++) {
            let keyId = filteredArray_y[i]
            let keyData = this.data.keys.getItem(keyId)
            let extraClass = ""

            if (!keyData.active) {
                extraClass = "unactive"
            }
            var htmlString = ""
            htmlString += '<div id="' + keyId + '" class="key_item ' + extraClass + ' _bg_dev">'
            htmlString += keyData.text
            htmlString += '<div class="key_value ' + extraClass + '">' + keyData.realValue + '</div>'
            htmlString += '<div class="key_metadata"></div>'
            htmlString += '</div>'
            if (i < filteredArray_y.length - 1) {
                htmlString += '<hr>'
            }
            keys_content_height += keyItemHeight
            $(this.selector + " .keys_content").append(htmlString)
            var metadataHeight = 0
            if (keyData.meta.arrayItems.length > 0) {
                metadataHeight += this.create_metadata(keyData, extraClass)
            }
            keys_content_height += metadataHeight
            var itemHeight = keyItemHeight_woHr + metadataHeight
            $(this.selector + " #" + keyId).css({
                height: itemHeight
            })
            //}
        }

        var htmlString = ""
        htmlString += '<div class="key_axis_header _bg_dev" style="width:100%; height:22px;">'
        htmlString += this.fileManagerRef.graphD3_ref.xAxisText
        htmlString += '</div>'
        htmlString += '<hr>'
        $(this.selector + " .keys_content").append(htmlString)
        keys_content_height += 22

        for (let i = 0; i < filteredArray_x.length; i++) {
            let keyId = filteredArray_x[i]
            let keyData = this.data.keys.getItem(keyId)
            let extraClass = ""

            if (!keyData.active) {
                extraClass = "unactive"
            }
            var htmlString = ""
            htmlString += '<div id="' + keyId + '" class="key_item ' + extraClass + ' _bg_dev">'
            htmlString += keyData.text
            htmlString += '<div class="key_value ' + extraClass + '">' + keyData.realValue + '</div>'
            htmlString += '<div class="key_metadata"></div>'
            htmlString += '</div>'
            if (i < filteredArray_x.length - 1) {
                htmlString += '<hr>'
            }
            keys_content_height += keyItemHeight
            $(this.selector + " .keys_content").append(htmlString)
            var metadataHeight = 0
            if (keyData.meta.arrayItems.length > 0) {
                metadataHeight += this.create_metadata(keyData, extraClass)
            }
            keys_content_height += metadataHeight
            var itemHeight = keyItemHeight_woHr + metadataHeight
            $(this.selector + " #" + keyId).css({
                height: itemHeight
            })
        }
        //--
        return keys_content_height
    }
    FileItem.prototype.create_metadata = function (keyData, extraClass) {
        if (keyData.meta.arrayItems.length > 0) {
            let totalHeight = 0
            let itemHeight = 18

            for (let i = 0; i < keyData.meta.arrayItems.length; i++) {
                let subKey = keyData.meta.arrayItems[i]
                let subKeyData = keyData.meta.getItem(subKey)
                let htmlString = ""

                htmlString += '<div id="' + subKey + '" class="subkey_item ' + extraClass + ' _bg_dev" style="height:' + itemHeight + 'px;">'
                htmlString += subKeyData.text
                htmlString += '<div class="key_value ' + extraClass + '">' + subKeyData.value + '</div>'
                htmlString += '</div>'
                //--
                totalHeight += itemHeight
                $(this.selector + " #" + keyData.keyId + " .key_metadata").append(htmlString)
            }
            return totalHeight
        } else {
            return 0
        }
    }
    FileItem.prototype.onHeaderShown = function () {
        TweenMax.to(this.fileSelector + " .file_content", 0.2, {
            top: "0px",
        })
    }
    FileItem.prototype.close = function () {
        //--
        TweenMax.to(this.fileSelector + " .file_content", 0.2, {
            top: -this.totalHeight + "px",
        })
        TweenMax.to(this.fileSelector, 0.2, {
            delay: 0.2,
            left: "941px"
        })
        TweenMax.to(this.fileSelector + " .file_header", 0.2, {
            delay: 0.2,
            width: "22px",
            "onComplete": this.onClosed,
            "onCompleteScope": this,
        })
    }
    FileItem.prototype.onClosed = function () {
        $(this.fileSelector).css({
            opacity: 0
        })
        $(this.fileSelector).remove()
    }

    function OrgLines(_selector, _graphD3_ref) {
        this.selector = _selector
        this.graphD3_ref = _graphD3_ref
        //--
        this.vline_x = 681
        this.p3 = {x: this.vline_x, y: -24}
        this.p4 = {x: 875, y: -24}
        //-
        this.selectedOrg = null
        this.selectedLine = null
        this.counter = 0
        this.lines = {}
        //--
        this.graphD3_ref.emitter.addEventListener("onOrgSelected", this.onOrgSelected, this)
    }

    OrgLines.prototype.createLine = function (originX, originY) {
        originX = Math.round(originX) + 36;
        originY = Math.round(originY) + 20;
        let lineId = "line_" + this.counter;

        this.selectedLine = lineId;
        this.lines[lineId] = new PolylineaCSS(lineId, this.selector, false, "#f16764", true)
        this.lines[lineId].nuevoTramo({x: originX + 350, y: originY}, {x: this.vline_x, y: originY})
        this.lines[lineId].nuevoTramo({x: this.vline_x, y: originY}, {x: this.p3.x, y: this.p3.y})
        this.lines[lineId].nuevoTramo({x: this.p3.x, y: this.p3.y}, {x: this.p4.x, y: this.p4.y})
        this.lines[lineId].init()
        this.lines[lineId].mostrar(0.5, 0, this.createFile, this)

        this.counter++
    }

    OrgLines.prototype.createFile = function (id, ref) {
        this.graphD3_ref.emitter.emitir("onCreateFile", {orgId: this.selectedOrg})
        $(this.graphD3_ref.mainSelector + " .polyline_mov_cir").css({
            opacity: 0
        })
    }

    OrgLines.prototype.eval_removeLine = function () {
        if (this.selectedLine != null) {
            this.lines[this.selectedLine].ocultar(0.5, 0.4, this.killLine, this, this.selectedLine)
            this.selectedLine = null
        }
    }
    OrgLines.prototype.killLine = function (id, ref) {
        let lineId = ref.lineaId;

        ref.initKill()
        this.lines[lineId] = null
    }

    OrgLines.prototype.onOrgSelected = function (event) {
        if (event.orgId == null) {
            this.selectedOrg = null
            this.eval_removeLine()
        } else if (this.selectedOrg !== event.orgId) {
            this.selectedOrg = event.orgId
            this.eval_removeLine()
            this.createLine(event.x, event.y)
        }

    }

    function Axis_Panel(_selector, _axisId, _height, _graphD3_ref) {
        this.selector = _selector
        this.axisId = _axisId
        this.height = _height
        this.graphD3_ref = _graphD3_ref
        //--
        this.tween == null
        //--
        this.isOpen = true
        //--
        this.graphD3_ref.emitter.addEventListener("onOrgSelected", this.onOrgSelected, this)
    }

    Axis_Panel.prototype.onOrgSelected = function (event) {
        if (event.orgId != null) {
            this.close()
        } else {
            if (event.openPannels) {
                this.open()
            }
        }
    }
    Axis_Panel.prototype.open = function (event) {
        if (this.tween != null) {
            this.tween.kill()
        }
        this.tween = TweenMax.to(this.selector + " .content", 0.25, {
            delay: 1,
            top: 0
        })
    }
    Axis_Panel.prototype.close = function (event) {
        if (this.tween != null) {
            this.tween.kill()
        }
        if (this.axisId === "y") {
            this.tween = TweenMax.to(this.selector + " .content", 0.25, {
                top: -(this.height - 12)
            })
        } else if (this.axisId === "x") {
            this.tween = TweenMax.to(this.selector + " .content", 0.25, {
                top: (this.height - 12)
            })
        }
    }

    function GUI_Swicth(_selector, _switchId) {
        this.selector = _selector
        this.switchId = _switchId
        //--
        this.emisor = new Emisor()
        //--
        this.activated = true
        //--
    }

    GUI_Swicth.prototype.init = function () {
        let that = this
        $(this.selector).click(function () {
            that.do_switch()
        })
    }
    GUI_Swicth.prototype.do_switch = function () {
        if (this.activated) {
            this.deactivate()
        } else {
            this.activate()
        }
    }

    GUI_Swicth.prototype.deactivate = function () {
        this.activated = false
        this.emisor.emitir("onDeactivatedSwitch", {switchId: this.switchId})
        TweenMax.to(this.selector + " .switch_gui_fg", 0.2, {
            left: 0,
            "background-color": "#888888"
        })
    }
    GUI_Swicth.prototype.activate = function () {
        this.activated = true
        this.emisor.emitir("onActivatedSwitch", {switchId: this.switchId})
        TweenMax.to(this.selector + " .switch_gui_fg", 0.2, {
            left: 15,
            "background-color": "#f16764"
        })
    }

    function PolylineaCSS(_lineaId, _selector_ctxt, _visible, _colorHex, _withCir) {
        this.lineaId = _lineaId
        this.selector_ctxt = _selector_ctxt
        this.colorHex = _colorHex
        this.withCir = _withCir || false
        this.ratio_ctxt = 1
        this.contador = 0
        this.tramos = new Datos()
        this.timeout
        this.mostrandose = _visible
        if (this.withCir) {
            $(this.selector_ctxt).append('<div id="' + this.lineaId + '_sel_cir" class="polyline_sel_cir polyline_cir"></div>')
            $(this.selector_ctxt).append('<div id="' + this.lineaId + '_mov_cir" class="polyline_mov_cir polyline_cir"></div>')
        }


    }

    PolylineaCSS.prototype.init = function () {
        if (!this.mostrandose) {
            this.ocultarSinAnim()
        }
    }
    PolylineaCSS.prototype.initKill = function () {
        for (let i = 0; i < this.tramos.arrayItems.length; i++) {
            let tramoId = this.tramos.arrayItems[i]
            $(this.selector_ctxt + " #" + tramoId).remove()
        }
        if (this.withCir) {
            $(this.selector_ctxt + " #" + this.lineaId + "_sel_cir").remove()
            $(this.selector_ctxt + " #" + this.lineaId + "_mov_cir").remove()
        }

    }

    PolylineaCSS.prototype.ocultar = function (_tiempoAnim, _pausa, _callback, _callbackScope) {
        _pausa = _pausa || 0
        if (_pausa === 0) {
            if (this.mostrandose) {
                this.mostrandose = false
                let numTramos = this.tramos.arrayItems.length
                let tiempoAnim = _tiempoAnim / numTramos
                //--
                let j
                for (let i = this.tramos.arrayItems.length - 1; i >= 0; i--) {

                    j = this.tramos.arrayItems.length - i - 1
                    let tramoId = this.tramos.arrayItems[i]
                    let tramoTemp = this.tramos.getItem(tramoId)
                    //--
                    let objAnim = {}
                    if (i > 0) {
                        objAnim = {
                            "width": "0px",
                            "delay": _pausa + (j * tiempoAnim)
                        }
                    } else {
                        objAnim = {
                            "width": "0px",
                            "delay": _pausa + (j * tiempoAnim),
                            "onComplete": _callback,
                            "onCompleteScope": _callbackScope,
                            "onCompleteParams": [tramoId, this]
                        }
                    }
                    TweenMax.to($(this.selector_ctxt + " #" + tramoId), tiempoAnim, objAnim)
                    if (this.withCir) {
                        TweenMax.to($(this.selector_ctxt + " #" + this.lineaId + "_mov_cir"), tiempoAnim, {
                            "left": tramoTemp.p1.x + "px",
                            "top": tramoTemp.p1.y + "px",
                            "delay": _pausa + (j * tiempoAnim),
                        })
                    }
                }
                window.clearTimeout(this.timeout);
                this.timeout = setTimeout(this.finOcultar, (_pausa + _tiempoAnim) * 1000, this);
                //--
                if (this.withCir) {
                    $(this.selector_ctxt + " #" + this.lineaId + "_mov_cir").css({
                        opacity: 1
                    })
                    TweenMax.to($(this.selector_ctxt + " #" + this.lineaId + "_mov_cir"), _tiempoAnim / 3, {
                        "height": "6px",
                        "width": "6px",
                        "delay": 0,
                    })
                }
            }
        } else {
            TweenMax.delayedCall(_pausa, this.ocultar, [_tiempoAnim, 0, _callback, _callbackScope], this)
        }
    }

    PolylineaCSS.prototype.finOcultar = function (scope) {
        scope.ocultarSinAnim()
    }

    PolylineaCSS.prototype.mostrar = function (_tiempoAnim, _pausa, _callback, _callbackScope) {
        if (!this.mostrandose) {
            window.clearTimeout(this.timeout);
            this.mostrandose = true
            let numTramos = this.tramos.arrayItems.length
            let tiempoAnim = _tiempoAnim / numTramos
            //--
            for (let i = 0; i < this.tramos.arrayItems.length; i++) {
                let tramoId = this.tramos.arrayItems[i]
                let tramoTemp = this.tramos.getItem(tramoId)
                //--
                $(this.selector_ctxt + " #" + tramoId).removeClass("oculto")
                //--
                let objAnim = {}
                if (i < this.tramos.arrayItems.length - 1) {
                    objAnim = {
                        "width": tramoTemp.distancia + "px",
                        "delay": _pausa + (i * tiempoAnim)
                    }
                } else {
                    objAnim = {
                        "width": tramoTemp.distancia + "px",
                        "delay": _pausa + (i * tiempoAnim),
                        "onComplete": _callback,
                        "onCompleteScope": _callbackScope,
                        "onCompleteParams": [tramoId, this]
                    }
                }
                TweenMax.to($(this.selector_ctxt + " #" + tramoId), tiempoAnim, objAnim)
                if (this.withCir) {
                    TweenMax.to($(this.selector_ctxt + " #" + this.lineaId + "_mov_cir"), tiempoAnim, {
                        "left": tramoTemp.p2.x + "px",
                        "top": tramoTemp.p2.y + "px",
                        "delay": _pausa + (i * tiempoAnim),
                    })
                }
            }
            if (this.withCir) {
                TweenMax.to($(this.selector_ctxt + " #" + this.lineaId + "_mov_cir"), _tiempoAnim / 3, {
                    "height": "22px",
                    "width": "22px",
                    "delay": _tiempoAnim * 0.66,
                })
            }
        }
    }


    PolylineaCSS.prototype.nuevoTramo = function (p1, p2) {
        let tramoTemp = new TramoCSS(p1, p2)
        let tramoId = this.lineaId + "_tramo_" + this.contador

        tramoTemp.p1_r = {x: (p1.x / this.ancho_ctxt) * 100, y: (p1.y / this.alto_ctxt) * 100}
        tramoTemp.p2_r = {x: (p2.x / this.ancho_ctxt) * 100, y: (p2.y / this.alto_ctxt) * 100}
        tramoTemp.angulo = this.get_angleDeg2pts(p1, p2)
        tramoTemp.distancia = this.get_disntance2pts(tramoTemp.p1, tramoTemp.p2, 1, this.ratio_ctxt)

        this.contador++
        this.tramos.nuevoItem(tramoId, tramoTemp)
        //--
        $(this.selector_ctxt).append('<div id="' + tramoId + '" class="line css_line"></div>')
        $(this.selector_ctxt + " #" + tramoId).css({
            "transform": "rotate(" + tramoTemp.angulo + "deg)",
            "width": tramoTemp.distancia + "px",
            "left": tramoTemp.p1.x + "px",
            "top": tramoTemp.p1.y + "px",
            "border-top": "1px dashed " + this.colorHex
        })
        //--
        if (this.withCir && this.contador === 1) {
            let posX_sel = p1.x - 3
            let posY_sel = p1.y

            $(this.selector_ctxt + " #" + this.lineaId + "_sel_cir").css({
                left: posX_sel + "px",
                top: posY_sel + "px",
            })

            let posX_mov = p1.x
            let posY_mov = p1.y

            $(this.selector_ctxt + " #" + this.lineaId + "_mov_cir").css({
                left: posX_mov + "px",
                top: posY_mov + "px",
            })
        }
    }

    PolylineaCSS.prototype.ocultarSinAnim = function () {
        for (let i = 0; i < this.tramos.arrayItems.length; i++) {
            let tramoId = this.tramos.arrayItems[i];

            $(this.selector_ctxt + " #" + tramoId).addClass("oculto")
            $(this.selector_ctxt + " #" + tramoId).css({
                "width": "0px",
            })
        }
    }

    PolylineaCSS.prototype.get_angleDeg2pts = function (p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    }

    PolylineaCSS.prototype.get_disntance2pts = function (p1, p2, correctorX, correctoyY) {
        let a = p1.x * correctorX - p2.x * correctorX;
        let b = p1.y * correctoyY - p2.y * correctoyY;
        return Math.sqrt(a * a + b * b);
    }

    PolylineaCSS.prototype.get_puntoInicial = function () {
        let tramoTemp = this.tramos.getItemAt(0)

        return tramoTemp.p1_r
    }

    PolylineaCSS.prototype.get_puntoFinal = function () {
        let tramoTemp = this.tramos.getItemAt(this.tramos.arrayItems.length - 1)
        return tramoTemp.p2_r
    }
    PolylineaCSS.prototype.testScope = function (txt) {
        console.log("(PolylineaCSS.testScope) ------------------- " + txt);
    }

    function TramoCSS(_p1, _p2) {
        this.p1 = _p1
        this.p2 = _p2
        this.p1_r
        this.p2_r
        this.angulo
        this.distancia

    }

    function Datos() {
        this.dataItems = {};
        this.arrayItems = [];
    }
    Datos.prototype.nuevoItem = function (itemId, item) {
        if (!this.evalExiste(itemId)) {
            this.arrayItems.push(itemId);
            this.dataItems[itemId] = item;
        }
    };
    Datos.prototype.quitarItem = function (itemId) {
        if (this.evalExiste(itemId)) {
            let item = this.dataItems[itemId]
            item = {}
            this.arrayItems = this.quitarElemArray(this.arrayItems, itemId)
        }
    }

    Datos.prototype.getItem = function (itemId) {
        if (this.evalExiste(itemId)) {
            return this.dataItems[itemId];

        } else {
            return undefined;
        }
    };
    Datos.prototype.getItemAt = function (pos) {
        if (pos < this.arrayItems.length) {
            let itemId = this.arrayItems[pos]
            return this.dataItems[itemId];

        } else {
            return undefined;
        }
    };
    Datos.prototype.evalExiste = function (itemId) {
        for (let i = 0; i < this.arrayItems.length; i++) {
            let valor = this.arrayItems[i];
            if (valor === itemId) {
                return true;
            }
        }
        return false;
    };

    Datos.prototype.quitarElemArray = function (a1, elem) {
        let aResultado = []
        for (let i = 0; i < a1.length; i++) {
            let valor = a1[i];
            if (valor !== elem) {
                aResultado.push(valorBase);
            }
        }
        return aResultado;
    }

    Datos.prototype.randomizar = function () {
        this.arrayItems = this._shuffleArray(this.arrayItems)
    }
    Datos.prototype.resetear = function () {
        this.dataItems = {};
        this.arrayItems = [];
    }

    Datos.prototype._shuffleArray = function (array1) {
        let array2 = []
        let numElem = array1.length;
        for (let i = 0; i < numElem; i++) {
            let numElemAhora = array1.length;
            let rndElem = Math.ceil(Math.random() * numElemAhora);
            array2.push(array1[rndElem - 1]);
            array1.splice(rndElem - 1, 1);
        }
        return array2;
    }

    function Emisor(_emisorId) {
        this.emisorId = _emisorId || ""
        this.eventos = new Datos();
        this.autonum = 0;
    }

    Emisor.prototype.traceListenersList = function (eventoId) {
        let evento = this.eventos.getItem(eventoId);
    }

    Emisor.prototype.addEventListener = function (eventoId, listener, scope) {
        this.nuevoEventListener(eventoId, listener, scope)
    }
    Emisor.prototype.nuevoEventListener = function (eventoId, listener, scope) {
        if (this.evalExisteEvento(eventoId)) {
            this._nuevoListener(eventoId, listener, scope);
        } else {
            this._nuevoEvento(eventoId);
            this._nuevoListener(eventoId, listener, scope);
        }
    }
    Emisor.prototype.removeEventListener = function (eventoId, listener, scope) {
        this.quitarEventListener(eventoId, listener, scope)
    }
    Emisor.prototype.quitarEventListener = function (eventoId, listener, scope) {
        if (this.evalExisteListener(eventoId, listener, scope)) {
            let listenerId = this.getListenerId(eventoId, listener, scope)
            let evento = this.eventos.getItem(eventoId)
            evento.listeners.quitarItem(listenerId)
        }
    }
    Emisor.prototype.emitir = function (eventoId, data) {
        if (data === null || data === undefined) {
            data = {}
        }
        if (this.eventos.evalExiste(eventoId)) {
            data.type = eventoId
            data.emisorId = this.emisorId
            let evento = this.eventos.getItem(eventoId);
            let listeners = evento.listeners;

            for (let i = 0; i < listeners.arrayItems.length; i++) {
                let listenerId = listeners.arrayItems[i];
                let objListener = evento.listeners.getItem(listenerId);
                let func = objListener.func;
                let scope = objListener.scope;
                func.call(scope, data);
            }
        }
    }
    Emisor.prototype._nuevoEvento = function (eventoId) {
        let evento = {};
        evento.eventoId = eventoId;
        evento.listeners = new Datos();
        this.eventos.nuevoItem(eventoId, evento);
    }
    Emisor.prototype._nuevoListener = function (eventoId, listener, scope) {
        if (this.evalExisteListener(eventoId, listener, scope)) {
            console.log("(Emisor._nuevoListener): " + eventoId);
        } else {
            this.autonum++;
            let listenerId = "listener_" + this.autonum;
            let evento = this.eventos.getItem(eventoId);
            //--
            let objListener = {};

            objListener.listenerId = listenerId;
            objListener.func = listener;
            objListener.scope = scope;
            //--
            evento.listeners.nuevoItem(listenerId, objListener);
        }
    }
    Emisor.prototype.evalExisteEvento = function (eventoId) {
        return this.eventos.evalExiste(eventoId);
    }
    Emisor.prototype.getListenerId = function (eventoId, listener, scope) {
        let listenerId = null
        let evento = this.eventos.getItem(eventoId);
        let listeners = evento.listeners

        for (let i = 0; i < listeners.arrayItems.length; i++) {
            let listenerIdTemp = listeners.arrayItems[i]
            let listenerAux = evento.listeners.getItem(listenerIdTemp).func
            let scopeAux = evento.listeners.getItem(listenerIdTemp).scope

            if (listener === listenerAux && scope === scopeAux) {
                listenerId = listenerIdTemp
            }
        }
        return listenerId
    }

    Emisor.prototype.evalExisteListener = function (eventoId, listener, scope) {
        let evento = this.eventos.getItem(eventoId);
        let listeners = evento.listeners;

        if (listeners.arrayItems.length === 0) {
            return false;
        } else {
            for (let i = 0; i < listeners.arrayItems.length; i++) {
                let listenerId = listeners.arrayItems[i]
                let listenerAux = evento.listeners.getItem(listenerId).func
                let scopeAux = evento.listeners.getItem(listenerId).scope

                if (listener === listenerAux && scope === scopeAux) {
                    return true;
                }
            }

            return false;
        }
    }

    function init_and_draw_matrix_chart(_mainSelector, _data, _affiliations, _xAxisText, _yAxisText) {
        matrix_chart = new GraphD3(_mainSelector, _data, _affiliations, _xAxisText, _yAxisText);
    }

    function _retrieve_affiliation_matrix_data_by_name(affiliation_name) {
        let all_affiliations_name_labels = $(".svg_cir_name");
        let affiliation_name_label_id = "";
        let affiliation_circle_id = "";

        Array.prototype.forEach.call(all_affiliations_name_labels, name_label => {
            let name_label_elem = $(name_label);

            if (name_label_elem.text() === affiliation_name) {
                affiliation_name_label_id = name_label_elem.attr("id");
                affiliation_circle_id = affiliation_name_label_id.substring(
                    affiliation_name_label_id.indexOf("org"), affiliation_name_label_id.length);
            }
        })

        return {
            "affiliation_circle_id": affiliation_circle_id,
            "affiliation_name_label_id": affiliation_name_label_id
        }
    }

    function _remove_affiliation_from_matrix_chart(affiliation_list_elem_id, affiliation_id, affiliation_name) {
        let affiliation_data_in_matrix = _retrieve_affiliation_matrix_data_by_name(affiliation_name);

        // Deselect item
        if (matrix_chart.selectedOrg === affiliation_data_in_matrix["affiliation_circle_id"]) {
            matrix_chart.selectItem(affiliation_data_in_matrix["affiliation_circle_id"],
            parseInt($("#" + affiliation_data_in_matrix["affiliation_circle_id"]).attr("cx")),
            parseInt($("#" + affiliation_data_in_matrix["affiliation_circle_id"]).attr("cy")))
        }

        $("#" + affiliation_data_in_matrix["affiliation_circle_id"]).remove();
        $("#" + affiliation_data_in_matrix["affiliation_name_label_id"]).remove();
        $("#" + affiliation_list_elem_id).remove();
        matrix_added_affiliations_ids.delete(affiliation_id);
        matrix_removed_affiliations_ids.add(affiliation_id);
    }

    function _open_affiliation_data_in_matrix_chart(affiliation_name) {
        let affiliation_data_in_matrix = _retrieve_affiliation_matrix_data_by_name(affiliation_name);

        matrix_chart.selectItem(affiliation_data_in_matrix["affiliation_circle_id"],
            parseInt($("#" + affiliation_data_in_matrix["affiliation_circle_id"]).attr("cx")),
            parseInt($("#" + affiliation_data_in_matrix["affiliation_circle_id"]).attr("cy")))
    }

    function set_matrix_chart_loading_state(is_loading) {
        if (is_loading) {
            $('#graph_1> *').remove();
            $('#graph_1').css("display", "none");
            $('#matrix_chart_spinner').css("display", "");
            $('#matrix_chart_search_orgs_id').css("display", "none");
        } else {
            $('#matrix_chart_spinner').css("display", "none");
            $('#graph_1').css("display", "");
            $('#matrix_chart_search_orgs_id').css("display", "");
        }
    }

    function set_up_matrix_chart_affiliations_search_bar(org_input_id) {
        let input_org = $(org_input_id);
        let csrf_token = getCookie('csrftoken');

        input_org.autocomplete({
            source: "/get-aff-suggestion/",
            autoFocus: false,

            select: function (event, ui) {
                let affiliation_slug_parts = ui.item['slug'].split("-");
                let added_affiliation_id = parseInt(affiliation_slug_parts[affiliation_slug_parts.length - 1])
                matrix_added_affiliations_ids.add(added_affiliation_id);
                matrix_removed_affiliations_ids.delete(added_affiliation_id);
                let user_added_affiliations_ids = get_user_added_affiliations_ids();
                let user_removed_affiliations_ids = get_user_removed_affiliations_ids();
                let matrix_chart_affiliations_ids = matrix_chart.affiliations_to_draw.map(({ id }) => id);
                matrix_chart_affiliations_ids = matrix_chart_affiliations_ids.concat(user_added_affiliations_ids)
                matrix_chart_affiliations_ids = matrix_chart_affiliations_ids.filter(value =>
                    !user_removed_affiliations_ids.includes(value))

                let matrix_chart_data = {
                    "selected_affiliations_ids": matrix_chart_affiliations_ids,
                    "query_filters": filter_values_json,
                }

                set_matrix_chart_loading_state(true);

                $.ajax({
                    url: "/get-charts/",
                    type: "POST",
                    dataType: "json",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-CSRFToken": csrf_token,
                    },
                    data: JSON.stringify(
                        {
                        "charts": {
                            "matrix_chart": matrix_chart_data,
                        }
                    })
                }).done(function(response) {
                    let matrix_chart_data = JSON.parse(response["matrix_chart"]["matrix_chart_data"]);
                    let matrix_chart_affiliations = JSON.parse(response["matrix_chart"]['matrix_chart_affiliations']);

                    set_matrix_chart_loading_state(false);
                    matrixChartModule.init_and_draw_matrix_chart("#graph_1", matrix_chart_data, matrix_chart_affiliations, "INNOVATION", "INVENTION");
                    matrixChartModule.set_up_matrix_chart_affiliations_search_bar('#matrix_chart_orgs_input_filter');
                }).fail(function (xhr, errmsg, err) {
                    console.log("Error loading matrix chart");
                });

                input_org.val('');
                return false;
            }
        }).autocomplete("instance")._renderItem = function (ul, item) {
            let $parent_div = $('<div>');

            $parent_div.addClass('auto-comp-parent input_block_suggester_helper');
            $parent_div.append($("<img class='icon_item icon_aff'></img>").attr({src: item.image}));
            $parent_div.append("<div class=\"item_text\">" + item.label.replace("company: ", "") + "</div>");
            $parent_div.append("<div class=\"tag_item tag_item_aff\">Org</div>");

            return $parent_div
                .appendTo(ul);
        };
    }

    function get_user_added_affiliations_ids() {
        return Array.from(matrix_added_affiliations_ids);
    }

    function get_user_removed_affiliations_ids() {
        return Array.from(matrix_removed_affiliations_ids);
    }

    return {
        init_and_draw_matrix_chart: init_and_draw_matrix_chart,
        set_up_matrix_chart_affiliations_search_bar: set_up_matrix_chart_affiliations_search_bar,
        set_matrix_chart_loading_state: set_matrix_chart_loading_state,
        get_user_added_affiliations_ids: get_user_added_affiliations_ids,
        get_user_removed_affiliations_ids: get_user_removed_affiliations_ids,
    };
})();