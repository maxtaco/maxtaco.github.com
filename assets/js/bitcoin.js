
function expected_hashes_per_block (params) {
	return ((params.difficulty / 0xffff) * Math.pow(2,48));
}

function expected_ltc_per_hash (params) {
	return params.block_reward/Math.max(expected_hashes_per_block(params), 1);
}

function usd_cost_per_hash (params) {
	return expected_ltc_per_hash(params) * params.usd_price;
}

function usd_cost_per_warp_wallet_guess (params) {
	return usd_cost_per_hash(params) * params.scrypt_c.warp / params.scrypt_c.litecoin;
}

function usd_cost_to_break_wallet (params) {
	return Math.pow(2,Math.min(params.entropy,256)-1)*usd_cost_per_warp_wallet_guess(params);
}

function usd_pp(n) {
	var thous = []
	function pad(x,n) {
		x = "" + x;
		while (x.length < n) { x = "0" + x; }
		return x;
  	};
  	var cents = pad(Math.round((n*100)%100),2);
	n = Math.floor(n);
	while (n >= 1000) {
		var v = n % 1000;
		n = Math.floor(n/1000);
		thous.push(pad(v,3));
	}
	if (n > 0) { thous.push(n); }
	thous.reverse();
	return "$" + thous.join(",") + "." + cents;
}

function get_params() {
	var F = function (x) { return +$("#" + x).val(); }
	return {
		usd_price : F("usd_price"),
		block_reward : F("block_reward"),
		difficulty : F("difficulty"),
		entropy : F("entropy"),
		scrypt_c : {
			litecoin : Math.pow(2,10),
			warp : Math.pow(2,18)
		}
	};
}

function compute() {
	$("#usd_break_cost").html(usd_pp(usd_cost_to_break_wallet(get_params())));
}

$(function () { 
	compute(); 
	var inputs = [ "usd_price", "block_reward", "difficulty", "entropy" ];
	for (var i in inputs) {
		var input = inputs[i];
		$("body").on("keyup", "#" + input, function () { compute(); })
		$("body").on("change", "#" + input, function () { compute(); })
	}
});