var infowindow;
var clusterOpened;
var markerCache = {};
// Var used to save the geo information between ajax calls
var g_maps_geo_info;

// Method that fires the map search
function bounds_changed(force) {
    /* We use the zoom > 1 to avoid queries when the event trigger but the user doesn't zoom
     *  if a infowindow is open we dont relaunch the search
     *  force is true when the user trigger the search by clicking in the button*/
    if (force || (map.getZoom() > 1)){
        var bounds = map.getBounds()
        var ne = bounds.getNorthEast()
        var sw = bounds.getSouthWest()

        filter_values_json["geo"] = {
            "ne": {"lat":ne.lat(), "lon":ne.lng()},
            "sw": {"lat":sw.lat(), "lon":sw.lng()},
            "zoom": map.getZoom(),
            "center": {"lat":map.getCenter().lat(), "lon":map.getCenter().lng()}
        };
        // Var used to save the geo information between ajax calls
        g_maps_geo_info = filter_values_json["geo"]
        markerCache = {}
        filter_used = 'geo_search'
        $("#map-top-entities-id").click()
        $('.nav-tabs a[href="#dashboard-data"]:first').tab('show');
        showOrgTab();
        ajax_search(filter_values_json)
    }

}

/* Used for triggering the map search when user deactivates map search */
function launchSearchInArea() {
    bounds_changed(true);
}

/*  Closing the info window */
function closeInfoWindow() {
    if (infowindow) {
        infowindow.close();
        infowindow = undefined;
        return true;
    } else {
        return false;
    }
}

function setMarkers(map, locations, reset = false) {
    // Add markers to the map

    // Marker sizes are expressed as a Size of X,Y
    // where the origin of the image (0,0) is located
    // in the top left of the image.

    // Origins, anchor positions and coordinates of the marker
    // increase in the X direction to the right and in
    // the Y direction down.
    // Shapes define the clickable region of the icon.
    // The type defines an HTML &lt;area&gt; element 'poly' which
    // traces out a polygon as a series of X,Y points. The final
    // coordinate closes the poly by connecting to the first
    // coordinate.
    var shape = {
        coord: [0, 0, 0, 32, 32, 32, 32, 0,  0, 0],
        type: 'poly'
    };
    var markers = [];

    if (reset) {
        markerCache = {};
        if (map.mCluster) {
            map.mCluster.clearMarkers();
        }
    }

    for (var i = 0; i < locations.length; i++) {
        var organization = locations[i];

        var image = {
            url: organization.image_url,
            // This marker is 20 pixels wide by 32 pixels tall.
            size: new google.maps.Size(150, 150),
            // The origin for this image is 0,0.
            origin: new google.maps.Point(0,0),
            // The anchor for this image is the base of the flagpole at 0,32.
            anchor: new google.maps.Point(0, 32),
            scaledSize: new google.maps.Size(50, 50)
        };
        var nothing = {
            url: '',
            // The shadow image is larger in the horizontal dimension
            // while the position and offset are the same as for the main image.
            size: new google.maps.Size(37, 32),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 32),
            scaledSize: new google.maps.Size(32, 32)
        };
        var myLatLng = new google.maps.LatLng(organization.latitude, organization.longitude);
        var latitudestr =  (organization.latitude + '').slice(0,6);
        var longitudestr = (organization.longitude + '').slice(0,6);
        var key = latitudestr + longitudestr;

        var html_content = "";

        if (key in markerCache) {
            var marker = markerCache[key];
            marker.number_pubs += organization.publications;
            marker.number_affiliations ++;
            marker.locations.push(i);
            marker.labelAnchor = new google.maps.Point(30 + (marker.number_affiliations * 50 / 2), 40);
            html_content += marker.labelContent;
        } else {
            html_content = "<div id='aff-master'>" + html_content; //+ '</div>';
            var marker = new MarkerWithLabel({
                zIndex: organization.zindex,
                title: organization.name,
                //icon: image,
                icon: nothing,
                position: myLatLng,
                draggable: false,
                map: map,
                //labelContent: html_content,
                labelAnchor: new google.maps.Point(30, 40),
                labelClass: "map-labels", // the CSS class for the label
                labelStyle: {opacity: 1},
                labelInBackground: false
            });
            marker.locations = [i];
            marker.number_pubs = organization.publications;
            marker.number_affiliations = 1;
            //marker.authors = authors;
            marker.image_url = organization.image_url;
            markers.push(marker);
            markerCache[key] = marker;
        }

    }

    styles_edited = [
        {
            height: 53,
            width: 53,
            url: "/static/img/gmapsclusters/m1.png",
            textColor: 'white'
        },
        {
            height: 56,
            width: 56,
            url: "/static/img/gmapsclusters/m2.png",
            textColor: 'white'
        },
        {
            height: 66,
            width: 66,
            url: "/static/img/gmapsclusters/m3.png",
            textColor: 'white'
        },
        {
            height: 78,
            width: 78,
            url: "/static/img/gmapsclusters/m3.png",
            textColor: 'white'
        },
        {
            height: 90,
            width: 90,
            url: "/static/img/gmapsclusters/m3.png",
            textColor: 'white'

        }
    ]

    if (!map.mCluster) {
        let mcOptions = {minimumClusterSize: 1, maxZoom: 14, gridSize: 40, zoomOnClick: false, styles: styles_edited};
        let markerClusterer = new MarkerClusterer(map, markers, mcOptions);

        markerClusterer.setCalculator(marker_label_calculator);
        map.mCluster = markerClusterer;
        google.maps.event.addListener(markerClusterer, 'clusterclick', show_preview_click);
        google.maps.event.addListener(map,'zoom_changed',closeInfoWindow);
    } else {
        map.mCluster.addMarkers(markers);
    }
}


function marker_label_calculator(markers, numStyles) {
    var number_affiliations = 0;
    for (i=0; i < markers.length; i++) {
        number_affiliations += markers[i].locations.length;
    }
    var count = markers.length.toString();
    var dv = count;
    var index = 0;
    while (dv !== 0) {
        dv = parseInt(dv / 10, 10);
        index++;
    }

    index = Math.min(index, numStyles);
    return {
        //text: count,
        text: number_affiliations,
        index: index,
        title: ''
    };
}

function show_preview_click(cluster){
    if (TEMPLATE_NAME == 'search'){
        ga_eventa('click', 'search_socialMapTab_ballClick');
    } else {
        ga_eventa('click', 'organizations_socialMapTab_ballClick');
    }

    // Checking zoom level
    // We show the infowindow in level 3 and lower
    if (map.getZoom() < 4) {
        map.setCenter(cluster.getCenter());
        map.setZoom(4);
        return
    }
    // Checking if a cluster is open
    if (clusterOpened == cluster) {
        clusterOpened = undefined;
        closeInfoWindow();
        return;
    } else {
        closeInfoWindow();
    }

    // Seting actual cluster
    clusterOpened = cluster;

    // Customizing gmaps marker icon to something not visible
    var nothing = {
        url: 'http://www.transparenttextures.com/patterns/asfalt-light.png',
        // The shadow image is larger in the horizontal dimension
        // while the position and offset are the same as for the main image.
        size: new google.maps.Size(0, 0),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(0, 0)
    };

    // Initializing infowindow marker
    var infowindow_marker = new google.maps.Marker({
        position: cluster.getCenter(),
        map: map,
        icon: nothing
    });

    //Little tricky to format the google maps' infowindow
    // Geting all markers from the cluster
    // NOTE:
    // A cluster is a union of affiliations, it appears like a circle in the map
    // The affiliation are the markers
    markers = cluster.getMarkers();
    // masterDiv is the element that we use as infowindow content
    // We generete the html via js
    // Initializing masterDiv
    var masterDiv = document.createElement("div");
    // Customizing it
    masterDiv.style.marginTop = '0px';
    masterDiv.style.width = '320px';
    masterDiv.style.height = '240px';
    masterDiv.style.marginLeft = '0px';
    masterDiv.style.border = 'none';
    //masterDiv.style.borderRadius = '10px'
    masterDiv.style.fontFamily = 'Open Sans';
    masterDiv.className += 'info-master-div';
    //masterDiv.id = 'tabs-info-window';

    //Creating element where the tabs go
    // In case we have more than 4 affiliations we use tabs
    var tabList = document.createElement('ul');
    tabList.className += ' pagination pagination-sm';

    //Creating element where the tabs content go
    var tabContent = document.createElement('div');
    tabContent.className += ' tab-content';

    // Assigning them to the parent element
    masterDiv.appendChild(tabContent);
    masterDiv.appendChild(tabList);

    // Initializing vars
    var totalAffs = 0;
    var tabDiv;
    var firstTime = true;
    // We iterate over the affiliations in the cluster
    for (var i = 0;i < markers.length; i++) {
        var marker = markers[i];
        for (var j = 0; j < marker.locations.length; j++ ) {
            // 4 affiliations per page
            var pagination = 4;
            if ((totalAffs + pagination) % pagination == 0) {
                // Creating and customizing the tab element
                var tabElement = document.createElement('li');
                //tabElement.style.background = "white"
                var linkElement = document.createElement('a');
                //linkElement.style.color = "#1F6AA6"
                //linkElement.className += ' text-regular';
                let att = document.createAttribute("data-bs-target");       // Create a "class" attribute
                att.value = '#infowindow-tab-' + ((totalAffs / pagination) >> 0);                           // Set the value of the class attribute
                linkElement.setAttributeNode(att);

                let att2 = document.createAttribute("data-bs-toggle");       // Create a "class" attribute
                att2.value = "tab";                           // Set the value of the class attribute
                linkElement.setAttributeNode(att2);

                //linkElement.href = '#infowindow-tab-' + ((totalAffs / pagination) >> 0);
                linkElement.appendChild(document.createTextNode('' + (((totalAffs / pagination) >> 0) + 1)));
                tabElement.appendChild(linkElement);
                // Assigning the tab element to tab list
                tabList.appendChild(tabElement);
                // tabDiv store the tab content
                tabDiv = document.createElement('div');
                //tabDiv.style.width = '290px';
                tabDiv.style.height = '190px';
                tabDiv.id ='infowindow-tab-' + ((totalAffs / pagination) >> 0);
                tabDiv.className += ' tab-pane';
                tabContent.appendChild(tabDiv);

                if (firstTime){
                    tabDiv.className += ' active';
                    tabElement.className += ' active';
                    firstTime = false;
                }
            }
            totalAffs++;
            // Getting the affiliation from the list
            let organization = current_organizations[marker.locations[j]];
            // Initializing the element where we store the affiliation information
            var elementDiv = document.createElement("div");
            elementDiv.onclick = function(p){
                return function(){
                    if (TEMPLATE_NAME == 'search'){
                        ga_eventa('click', 'search_socialMapTab_organizationClick');
                    } else {
                        ga_eventa('click', 'organizations_socialMapTab_organizationClick');
                    }
                    window.open(p, '_blank');
                }
            }(organization.url);
            elementDiv.style.cursor = "pointer";
            // Element where we store the affiliation name
            var listTextElement = document.createElement("span");
            // Styling it and setting the affiliation name
            listTextElement.style.marginLeft = "7px";
            listTextElement.title = organization.name;
            if (organization.name.length >= 36) {
                var name = organization.name.slice(0, 36) + '...';
            } else {
                var name = organization.name;
            }
            listTextElement.appendChild(document.createTextNode(name));
            listTextElement.className = "tx-corp";
            listTextElement.className += ' text-regular';
            listTextElement.style.fontFamily = 'Open Sans';
            listTextElement.style.float = "inherit"
            listTextElement.style.lineHeight = "40px"

            //listTextElement.style.marginTop = '11px';
            // Element where we store the affiliation pubs counter
            var listNumberElement = document.createElement("span");
            // Styling it and setting the affiliation pub counter
            listNumberElement.appendChild(document.createTextNode(organization.publications));
            //listNumberElement.style.marginTop = '11px';
            //listNumberElement.style.marginRight = '0px';
            listNumberElement.className += " tx-corp text-regular"
            listNumberElement.style.fontFamily = 'Open Sans';
            listNumberElement.style.float = "right"
            listNumberElement.style.lineHeight = "40px"

            // We put the name and pub counter inside a tag
            var listLinkElement = document.createElement("a");
            listLinkElement.appendChild(listTextElement);
            listLinkElement.appendChild(listNumberElement);


            // Element where we store the affiliation image
            var listImage = document.createElement("img");
            listImage.src = organization.image_url;
            listImage.style.width = '40px';
            listImage.style.maxHeight = '40px';
            //listImage.style.paddingRight = '10px';
            // Storing the image and link element in the parent div where we store the affiliation information
            elementDiv.appendChild(listImage);
            elementDiv.appendChild(listLinkElement);
            //.style.verticalAlign = 'middle';
            //elementDiv.style.paddingBottom = '5px';
            //elementDiv.style.marginTop = '5px';
            elementDiv.style.height = '50px';

            // Adding it to the tab content
            tabDiv.appendChild(elementDiv);
        }
    }

    // We correct the position
    switch (map.zoom) {
        case 4:
            lat_correction = 3;
            break;
        case 5:
            lat_correction = 2;
            break;
        default:
            lat_correction = 1;
    }
    map.panTo(new google.maps.LatLng(cluster.getCenter().lat()+lat_correction, cluster.getCenter().lng()));

    // We set the infowindow content with the generated html
    infowindow = new google.maps.InfoWindow({
        content: masterDiv
        //position: cluster.getCenter()
        //maxWidth: '310px'
        //pixelOffset: new google.maps.Size(7 + (j - 1) * 62 - (total * 50 / 2), -30),
    });
    // Showing infowindow
    setTimeout(function(){ infowindow.open(map,infowindow_marker); }, 400);



    // Removing the overflow in the infowindow (parent of the masterDiv element)
    google.maps.event.addListener(infowindow, 'domready', function() {
        $('.gm-style-iw').children(":first").css("overflow","hidden");
    });

}
