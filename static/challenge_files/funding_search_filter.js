    // When we lose focus in the input form we show again the add button
    $( "#funding_values" )
            .focusout(function() {
                $("#add_funding_filter").show();
                $("#funding_filter_input").hide();
            });

    // Generating the div and adding a new funding
    function add_new_funding_checkbox(reference, funding_name){
        let funding_info = funding_values_json[funding_name];
        let value_funding = funding_info["value"];
        let total_funding = funding_info["total"];
        let scale_funding = funding_info["scale"];

        reference.prepend(
             "<div class='height-tam22 entry-filter-wrapper'>" +
                 "<div class='checkbox no-padding-no-margin'>" +
                     "<label class='filter-checkbox-label'>"+
                         "<div class='checkbox-name-numbers-filter'>" +
                            '<div class="checkbox-name-numbers-filter">' +
                                '<input id="#funding_filter_'+scale_funding+'" class="input-filter-check visible-onclick-filter" type="checkbox" checked="checked" onclick="check_funding_filter_modified(add_funding_filter_search("'+scale_funding+'"));check_filter_modified()">'+
                                '<div class="text-tam13 text-numbers-filter-wrapper">'+
                                    '<div class="filter-name-entry">'+
                                        '<span data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" data-bs-container="body" title="" data-bs-original-title="'+funding_name+'">'+funding_name+'</span>'+
                                    '</div>'+
                                    '<div class="filter-number" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" data-bs-container="body" title="" data-bs-original-title="Matching filters <sub>Total results</sub>">'+value_funding+' <sub>'+total_funding+'</sub></div>'+
                                '</div>'+
                            '</div>'+
                         "</div>" +
                         "<div class='progress filter-progress'>" +
                             "<div class='progress-bar filter-progress-bar-funding' role='progressbar' aria-valuenow='" + value_funding + "' aria-valuemin='0' aria-valuemax='" + total_funding + "' style='transition: none 0s ease 0s;background-image: none; background-color: rgb(75, 220, 127); width: 100%;'></div>" +
                         "</div>" +
                     "</label>" +
                 "</div>" +
             "</div>"
         );

        style_progress_bars();
    }

    // Setting the autocomplete values
    $( "#funding_values" ).autocomplete({
        source: funding_names,
        autoFocus:true,
        select: function(event, ui) {

            let org_funding_filter_entry = funding_values_json[ui.item.value];
            let org_funding_scale_filter_entry = org_funding_filter_entry['scale'];
            let id_org_funding_scale = '#funding_filter_'+org_funding_scale_filter_entry;

            if ($(id_org_funding_scale).length > 0) {
                // Exists.
                if( $(id_org_funding_scale).attr('checked') !== 'checked' ){
                    $(id_org_funding_scale).click();
                }
            }else{
                add_new_funding_checkbox($("#funding-type-row"), ui.item.value)
                add_funding_filter_search(org_funding_scale_filter_entry);
                check_filter_modified();
            }
            $("#add_funding_filter").show();
            $("#funding_filter_input").hide();
        }
    });

    // When we show the funding input form we remove from the suggest list the selected values
    function show_funding_input(){
        let funding_selected = []
        // Getting all the funding showed
        $("#funding-type-row").find('input').each(function() {
            funding_selected.push($(this).attr('id'))
        });

        let funding_restricted = funding_names.filter(function (el) {
            return funding_selected.indexOf(el) < 0;
        });

        $( "#funding_values" ).autocomplete("option", "source", funding_restricted);

        $("#add_funding_filter").hide();
        $("#funding_values").val('');
        $("#funding_filter_input").show();
        $("#funding_values").trigger("focus");
    }

    function style_progress_bars(){
        // Customizing progress bar color
        $('.filter-progress-bar-funding').css({
            'background-image': 'none',
            'background-color': 'var(--aguamarina)'
        });

        // Setting progress bar width
        $('.filter-progress-bar-funding').each(function() {
            let valnow = $(this).attr("aria-valuenow");
            let valmax = $(this).attr("aria-valuemax");
            let val = valnow/valmax*100;
            val = val+'%';
            $( this ).width(val);
        });
    }

    style_progress_bars();