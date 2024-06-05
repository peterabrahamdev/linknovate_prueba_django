
 // When we lose focus in the input form we show again the add button
 $("#investors_values")
     .focusout(function() {
         $("#add_investors_filter").show();
         $("#investors_filter_input").hide();
     });

 // Generating the div and adding a new investors
 function add_new_investors_checkbox(reference, investor_name) {
     let investor_info = investors_values_json[investor_name];
     let value_investor = investor_info["value"];
     let total_investor = investor_info["total"];

     reference.prepend(
         "<div class='height-tam22 entry-filter-wrapper'>" +
             "<div class='checkbox no-padding-no-margin'>" +
                 "<label class='filter-checkbox-label'>"+
                     "<div class='checkbox-name-numbers-filter'>" +
                        '<div class="checkbox-name-numbers-filter">' +
                            '<input id="'+investor_name+'" class="input-filter-check visible-onclick-filter" type="checkbox" checked="checked" onclick="check_investors_filter_modified(add_investors_filter_search("'+investor_name+'"));check_filter_modified()">'+
                            '<div class="text-tam13 text-numbers-filter-wrapper">'+
                                '<div class="filter-name-entry">'+
                                    '<span data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" data-bs-container="body" title="" data-bs-original-title="'+investor_name+'">'+investor_name+'</span>'+
                                '</div>'+
                                '<div class="filter-number" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" data-bs-container="body" title="" data-bs-original-title="Matching filters <sub>Total results</sub>">'+value_investor+' <sub>'+total_investor+'</sub></div>'+
                            '</div>'+
                        '</div>'+
                     "</div>" +
                     "<div class='progress filter-progress'>" +
                         "<div class='progress-bar filter-progress-bar-investors' role='progressbar' aria-valuenow='" + value_investor + "' aria-valuemin='0' aria-valuemax='" + total_investor + "' style='transition: none 0s ease 0s;background-image: none; background-color: rgb(75, 220, 127); width: 100%;'></div>" +
                     "</div>" +
                 "</label>" +
             "</div>" +
         "</div>"
     );

     style_progress_investors_filter_bars();
 }

 // Setting the autocomplete values
 $("#investors_values").autocomplete({
     source: investors_names,
     autoFocus: true,
     select: function(_event, ui) {
         let org_investor_filter_entry = investors_values_json[ui.item.value];
         let org_investor_name = org_investor_filter_entry['name'];
         let id_org_investor = '#' + org_investor_name;

         if ($(id_org_investor).length > 0) {
             // Exists.
             if ($(id_org_investor).attr('checked') !== 'checked') {
                 $(id_org_investor).click();
             }
         } else {
             add_new_investors_checkbox($("#investors-type-row"), ui.item.value)
             add_investors_filter_search(org_investor_name);
             check_filter_modified();
         }
         $("#add_investors_filter").show();
         $("#investors_filter_input").hide();
     }
 });

 // When we show the investors input form we remove from the suggest list the selected values
 function show_investors_input() {
     let investors_selected = []
     // Getting all the investos showed
     $("#investors-type-row").find('input').each(function() {
         investors_selected.push($(this).attr('id'))
     });

     let investors_restricted = investors_names.filter(function(el) {
         return investors_selected.indexOf(el) < 0;
     });

     $("#investors_values").autocomplete("option", "source", investors_restricted);

     $("#add_investors_filter").hide();
     $("#investors_values").val('');
     $("#investors_filter_input").show();
     $("#investors_values").trigger("focus");
 }


function style_progress_investors_filter_bars() {
    // Customizing progress bar color
    $('.filter-progress-bar-investors').css({
        'background-image': 'none',
        'background-color': 'var(--aguamarina)'
    });

    // Setting progress bar width
    $('.filter-progress-bar-investors').each(function() {
        let valnow = $(this).attr("aria-valuenow");
        let valmax = $(this).attr("aria-valuemax");
        let val = valnow / valmax * 100;
        val = val + '%';
        $(this).width(val);
    });
}

style_progress_investors_filter_bars();