class MapHelper {
	/**
	 * 
	 * @param {string} incomingGeoJSON String representation of the geoJSON, with the feature to be added.
	 * @param {Object.<string, string>} style A dictionary with `color`, `opacity`, `weight`, `dashArray`, etc.
	 */
	static processAddedUNSWFeature(incomingGeoJSON, style) {
		var this_id = incomingGeoJSON["features"][0]["properties"]["Postal code"];
		console.log("this_id = " + this_id);

		var settings = {
			onEachFeature: function(feature, layer) {
				// https://leafletjs.com/examples/geojson/
				var preparedString = "";

				if (feature.properties && feature.properties["Name"]) {
					preparedString += "<strong>" + feature.properties["Name"] + "</strong>";
				}

				if (feature.properties && feature.properties["Postal code"]) {
					preparedString += "<br>Postal code: " + feature.properties["Postal code"] + "</strong>";
				}

				if (feature.properties && feature.properties["Median house price"]) {
					preparedString += "<br>Median house price: " + feature.properties["Median house price"] + "</em>";
				}



				//

				if (preparedString.length > 0) {
					layer.bindPopup(preparedString);
				}
		
				// // https://stackoverflow.com/questions/14756420/emulate-click-on-leaflet-map-item
				if (feature.properties && feature.properties["Postal code"]) {
					globalFeatureIDTracker[feature["Postal code"] + ""] = layer._leaflet_id;
				}
			}
		}

		if (style) {
			settings.style = style;
		}


		var addedFeature = L.geoJSON(incomingGeoJSON, settings).addTo(globalMapObject);

		globalFeatureIDTracker[this_id] = {
			"leaflet_id": Object.keys(addedFeature["_layers"])[0],
			"captured_geojson_object": addedFeature
		};
	}

	/**
	 * Simulates a mouse click on a place on the map.
	 * 
	 * @param {Object} selectedPlace The logical ID of the place on the map.
	 */
	static simulateMouseClick(selectedPlace) {
		var leafletID = globalFeatureIDTracker[selectedPlace]["leaflet_id"];
		var capturedGeoJSONObject = globalFeatureIDTracker[selectedPlace]["captured_geojson_object"];
		var layer = capturedGeoJSONObject.getLayer(leafletID);
		
		// https://stackoverflow.com/questions/14756420/emulate-click-on-leaflet-map-item
		// fire event 'click' on target layer 
		layer.fireEvent('click');
	}
}