var Socket = module.exports;
//var fs = require('fs');

var assert = function(condition, message) {
	if (!condition)
		throw Error("Assert failed" + (typeof message !== "undefined" ? ": " + message : ""));
};

Socket.message = function(message, func)
{
	if(func)
	{
		if(message === 'MessageWithAck')
			func('Simple Ack');
		else if(message === 'MessageWithBinaryAck')
			func(new Buffer("Binary Ack", 'binary'));
	}
}

Socket.eventWithNoAckAndTable = function(data)
{
	assert(data[0].var00);
	assert(data[0].var00 === 'value00');
	assert(data[0].var01);
	assert(data[0].var01 === 'value01');
	assert(data[1].var10);
	assert(data[1].var10 === 'value10');
	assert(data[1].var11);
	assert(data[1].var11 === 'value11');
}

Socket.eventWithNoAckAndDic = function(data)
{
	assert(data.var00);
	assert(data.var00 === 'value00');
	assert(data.var01);
	assert(data.var01 === 'value01');
}

Socket.eventWithSimpleAckAndDic = function(data, func)
{
	assert(data.var00);
	assert(data.var00 === 'value00');
	assert(data.var01);
	assert(data.var01 === 'value01');
	assert(func);
	func('Simple Ack');
}

Socket.eventWithBinaryAckAndDic = function(data, func)
{
	assert(data.var00);
	assert(data.var00 === 'value00');
	assert(data.var01);
	assert(data.var01 === 'value01');
	assert(func);
	func(new Buffer("Binary Ack", 'binary'));
}

Socket.eventAskSimpleEventWithNoAck = function(data, func)
{
	var socket = this.server.sockets.connected[this.client.id];
	
	socket.emit('SimpleEventWithNoAck', "Simple event");
}

Socket.eventAskBinaryEventWithNoAck = function(data, func)
{
	var socket = this.server.sockets.connected[this.client.id];
	
	socket.emit('BinaryEventWithNoAck', new Buffer("Binary event", 'binary'));
}

Socket.eventAskSimpleEventWithSimpleAck = function(data, func)
{
	var socket = this.server.sockets.connected[this.client.id];
	
	socket.emit('SimpleEventWithSimpleAck', "Simple event", function(ack)
	{
		assert(typeof ack === 'string');
		assert(ack === 'Simple Ack');
	});
}

Socket.eventAskSimpleEventWithBinaryAck = function(data, func)
{
	var socket = this.server.sockets.connected[this.client.id];
	
	socket.emit('SimpleEventWithBinaryAck', "Simple event", function(ack)
	{
		var string = String.fromCharCode.apply(null, new Uint16Array(ack));
		assert(typeof ack === 'object');
		assert(string === 'B i n a r y   A c k ');
	});
}

Socket.eventAskBinaryEventWithSimpleAck = function(data, func)
{
	var socket = this.server.sockets.connected[this.client.id];
	
	socket.emit('BinaryEventWithSimpleAck', new Buffer("Binary event", 'binary'), function(ack)
	{
		assert(typeof ack === 'string');
		assert(ack === 'Simple Ack');
	});
}

Socket.eventAskBinaryEventWithBinaryAck = function(data, func)
{
	var socket = this.server.sockets.connected[this.client.id];
	
	socket.emit('BinaryEventWithBinaryAck', new Buffer("Binary event", 'binary'), function(ack)
	{
		var string = String.fromCharCode.apply(null, new Uint16Array(ack));
		assert(typeof ack === 'object');
		assert(string === 'B i n a r y   A c k ');
	});
}

Socket.binaryMessageWithNoAck = function(data, func)
{
	var socket = this.server.sockets.connected[this.client.id];
	socket.emit(new Buffer("Binary message", 'binary'));
}

Socket.binaryMessageWithBinaryAck = function(data, func)
{
	var socket = this.server.sockets.connected[this.client.id];

	socket.emit(new Buffer("Binary message", 'binary'), function(ack)
	{
		var string = String.fromCharCode.apply(null, new Uint16Array(ack));
		assert(typeof ack === 'object');
		assert(string === 'B i n a r y   A c k ');
		console.log(string);
	});
}


Socket.disconnect = function(func)
{
	console.log ( "Client Disconnected :", this.client.conn.remoteAddress);
	
	for (var id in this.server.of('/').connected)
	{
		console.log( "Send disconnect from :", this.id, 'to :', id);
		
		this.server.of('/').connected[id].client.server.emit('disconnect',{'from':this.id});
	};
}
