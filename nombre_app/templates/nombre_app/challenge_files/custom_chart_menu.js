"use strict";

var customChartMenuModule = (function() {

    class menuState {
        constructor(current_menu_id, x_axis_selector_id, y_axis_selector_id,
                    y_op_selector_id, name_input_container_id, z_axis_selector_id) {

            this.current_menu_id = current_menu_id;

            // chart_type is set through 'set_*' method;

            this.x_axis_selector_id = x_axis_selector_id;
            this.y_axis_selector_id = y_axis_selector_id;
            this.y_op_selector_id = y_op_selector_id;
            this.name_input_container_id = name_input_container_id;
            this.z_axis_selector_id = z_axis_selector_id;
        }
    }

    let active_menus = {};
    let current_active_menu_id = "";


    function _init_axis_menu_items(axis_menu_id) {
        let x_dropdown_list = $("#" + active_menus[axis_menu_id].x_axis_selector_id);
        let y_op_dropdown_list = $("#" + active_menus[axis_menu_id].y_op_selector_id);
        let y_dropdown_list = $("#" + active_menus[axis_menu_id].y_axis_selector_id);

        for (const [i, x_field] of query_charts_axis_menu_item_values["x_fields"].entries()) {
            let default_value = i === 0;
            x_dropdown_list.append('<option data-default="' + default_value + '" value="' + x_field + '">' + x_field + '</option>');
        }

        for (const [i, y_op] of query_charts_axis_menu_item_values["y_operations"].entries()) {
            let default_value = i === 0;
            y_op_dropdown_list.append('<option data-default="' + default_value + '" value="' + y_op + '">' + y_op + '</option>');
        }

        for (const [i, y_field] of query_charts_axis_menu_item_values["y_fields"].entries()) {
            let default_value = i === 0;
            y_dropdown_list.append('<option data-default="' + default_value + '" value="' + y_field + '">' + y_field + '</option>');
        }

        if (active_menus[axis_menu_id].z_axis_selector_id) {
           let z_dropdown_list = $("#" + active_menus[axis_menu_id].z_axis_selector_id);

           for (const [i, z_field] of query_charts_axis_menu_item_values["sub_agg_fields"].entries()) {
                let default_value = i === 0;
                z_dropdown_list.append('<option data-default="' + default_value + '" value="' + z_field + '">' + z_field + '</option>');
            }
        }
    }

    function _hide_containers() {
        let axis_hidden_containers = $(".hidden-axis-selector");
        let multi_axis_hidden_containers = $(".hidden-multi-axis-selector");

        axis_hidden_containers.each(function () {
            $(this).hide();
        });

        multi_axis_hidden_containers.each(function () {
            $(this).css("visibility", "hidden");
        });
    }

    function _show_containers() {
        let axis_hidden_containers = $(".hidden-axis-selector");
        let multi_axis_hidden_containers = $(".hidden-multi-axis-selector");

        axis_hidden_containers.each(function () {
            $(this).show();
        });

        multi_axis_hidden_containers.each(function () {
            $(this).css("visibility", "unset");
        });
    }

    function _set_hidden_containers_visibility(element) {
        if (($(element)[0].value.trim() !== "All Records")) {
            _show_containers();
        } else {
            _hide_containers();
        }
    }

    function _init_axis_menu_events(axis_menu_id) {
        let y_dropdown_list = $("#" + active_menus[axis_menu_id].y_axis_selector_id);

        y_dropdown_list.on("change", function () {
            _set_hidden_containers_visibility(y_dropdown_list);
        });
    }

    function init_axis_menu(axis_menu_id, x_axis_selector_id, y_axis_selector_id, y_op_selector_id,
                            name_input_id, sub_agg_input_id="") {
        // Register a new active menu
        active_menus[axis_menu_id] = new menuState(axis_menu_id,
            x_axis_selector_id,
            y_axis_selector_id,
            y_op_selector_id,
            name_input_id,
            sub_agg_input_id);

        $("#create_custom_chart_modal").on('hidden.bs.modal', function() {
            close_custom_chart_menu();
        });

        _init_axis_menu_items(axis_menu_id);
        _init_axis_menu_events(axis_menu_id);
    }

    function set_axis_menu(axis_menu_id, current_chart_type) {
        $("#select_chart_menu_id").hide();
        $("#" + axis_menu_id).show();

        active_menus[axis_menu_id].chart_type = current_chart_type;
        current_active_menu_id = axis_menu_id;

        let x_dropdown_list = $("#" + active_menus[axis_menu_id].x_axis_selector_id);
        x_dropdown_list[0].disabled = active_menus[axis_menu_id].chart_type === "stream_chart";
    }

    function set_main_menu() {
        $("#" + current_active_menu_id).hide();
        $("#select_chart_menu_id").show();

        active_menus[current_active_menu_id].chart_type = "";
        current_active_menu_id = "";
    }

    function _reset_custom_chart_menu_error_messages() {
        $(".form-danger-msg").css("visibility", "hidden");
    }

    function _set_default_value(selector_id) {
        $("#"+selector_id).find("[data-default='true']")[0].selected = true;
    }

    function reset_custom_chart_menu() {
        _set_default_value(active_menus[current_active_menu_id].x_axis_selector_id);
        _set_default_value(active_menus[current_active_menu_id].y_axis_selector_id);
        _set_default_value(active_menus[current_active_menu_id].y_op_selector_id);

        _hide_containers();

        $("#" + active_menus[current_active_menu_id].name_input_container_id).val("");

        if ((active_menus[current_active_menu_id].z_axis_selector_id) && ($("#" + active_menus[current_active_menu_id].z_axis_selector_id)[0])) {
            _set_default_value(active_menus[current_active_menu_id].z_axis_selector_id);
        }

        _enable_submit_custom_chart_button();

        set_main_menu();
    }

    function close_custom_chart_menu() {
        let is_axis_menu_shown = false;

        bootstrap.Modal.getOrCreateInstance($('#create_custom_chart_modal')).hide();

        if (current_active_menu_id) {
            is_axis_menu_shown = $("#"+current_active_menu_id).css('display') !== "none";
        }

        if (is_axis_menu_shown) {
            reset_custom_chart_menu();
        }
    }

    function _enable_submit_custom_chart_button() {
        $("#submit_custom_chart_data_id").removeAttr('disabled');
    }

    function _disable_submit_custom_chart_button() {
        $("#submit_custom_chart_data_id").attr('disabled', 'disabled');
    }

    function submit_custom_chart_data() {
        let custom_charts = document.querySelectorAll("[class='custom-chart']");
        let last_custom_chart_id = (custom_charts.length > 0) ?
            $(custom_charts[0]).attr("id") : ""

        _disable_submit_custom_chart_button();
        request_chart_data_to_draw(last_custom_chart_id);
    }

    function load_custom_chart(chart_id, data_to_draw, chart_container_html, chart_type) {
        let dashboard_container = document.getElementById("dashboard-explore-height");
        let new_chart_container = $(chart_container_html)[0];

        dashboard_container.prepend(new_chart_container);

        chartsModule.drawChart(chart_type, '#'+chart_id, data_to_draw,
            filter_values_json);
    }

    function clean_custom_chart_card(chart_id) {
        let custom_chart_card = $('#'+chart_id+"_card");
        custom_chart_card.remove();
    }

    function delete_custom_chart(chart_id, search_session_id) {
        clean_custom_chart_card(chart_id);

        $.ajax({
                url: "/delete-chart/",
                type: 'POST',
                data: JSON.stringify({'search_session_id': sessionStorage.getItem("search_session_id"),
                    'chart_id': chart_id}),
                beforeSend: function (xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
                }
            }
        ).done(function (data) {
            commentGrowl("Your chart " + data["deleted_chart_name"] + " was deleted successfully", "my-info");
        }).fail(function (xhr, errmsg, err) {
            commentGrowl("An error occurred trying to delete a custom chart. Try again later.", "my-error");
        });
    }

    function request_chart_data_to_draw(last_chart_id) {
        let x_axis_field = $("#" + active_menus[current_active_menu_id].x_axis_selector_id)[0].value.trim();
        let y_axis_field = $("#" + active_menus[current_active_menu_id].y_axis_selector_id)[0].value.trim();
        let y_axis_op = "none";
        let chart_name = $("#" + active_menus[current_active_menu_id].name_input_container_id)[0].value.trim();
        let sub_agg_field = "";

        if (active_menus[current_active_menu_id].z_axis_selector_id) {
            sub_agg_field = $("#" + active_menus[current_active_menu_id].z_axis_selector_id)[0].value.trim();
        }


        if (y_axis_field !== "All Records") {
            y_axis_op = $("#" + active_menus[current_active_menu_id].y_op_selector_id)[0].value.trim();
        }

        show_loading_ajax_filters();

        let chart_agg_data = JSON.stringify({
            'x_field': x_axis_field,
            'y_field': y_axis_field,
            'y_op': y_axis_op,
            'name': chart_name,
            'sub_agg': sub_agg_field,
            'filters': filter_values_json,
            'last_chart_id': last_chart_id,
            'search_session_id': sessionStorage.getItem("search_session_id"),
            'chart_type': active_menus[current_active_menu_id].chart_type,
        });

        $.ajax({
                url: "/get-chart/",
                type: 'POST',
                data: chart_agg_data,
                beforeSend: function (xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
                }
            }
        ).done(function(data) {
            let new_chart_id = data["new_chart_id"];
            let new_chart_data_to_draw = data["new_chart_data_to_draw"];
            let new_chart_html = data["new_chart_html"];
            let new_chart_type = data["new_chart_type"]

            load_custom_chart(new_chart_id, new_chart_data_to_draw, new_chart_html, new_chart_type);
            close_custom_chart_menu();
        }).fail(function (xhr, errmsg, err) {
            // show error in modal
            console.log(xhr);
        }).always(function(dataOrjqXHR, textStatus, jqXHRorErrorThrown) {
            _enable_submit_custom_chart_button();
            remove_loading_ajax_filters();
        });
    }

    return {
        init_axis_menu: init_axis_menu,
        set_axis_menu: set_axis_menu,
        close_custom_chart_menu: close_custom_chart_menu,
        reset_custom_chart_menu: reset_custom_chart_menu,
        submit_custom_chart_data: submit_custom_chart_data,
        load_custom_chart: load_custom_chart,
        clean_custom_chart_card: clean_custom_chart_card,
        delete_custom_chart: delete_custom_chart,
    }

})();