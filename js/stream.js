function create_stream(source, get_byte, end_of_data)
{
	return {
		source:      source,
		get_byte:    get_byte,
		end_of_data: end_of_data,
		head:        get_byte(source),
		buffer:      []
	}
}


function read_stream_byte(stream)
{
	stream.head = stream.get_byte(stream.source)
}


function end_of_stream(stream)
{
	return stream.end_of_data( stream.source )
}


function add_byte_in_stream_buffer(stream, byte)
{
	stream.buffer.push(byte)
}

/*----------------Text stream---------------*/

function end_of_text_data(source)
{
	return source.i > source.data.length
}


function get_text_byte(source)
{
	if( !end_of_text_data(source) )
	{
		var byte = source.data[ source.i ]
		++source.i

		return byte
	}
}