function get_string(parser, format_close_brace)
{
	var string=''

	parser.get_byte()

	while(parser.head!=format_close_brace && parser.head!='\n' && !parser.end_of_data())
	{
		string+=parser.head
		parser.get_byte()

		if(parser.head=='\\')
		{
			parser.get_byte()
			parser.skip()
		}
	}

	if(parser.head!=format_close_brace)
	{
		console.log("expected "+format_close_brace)
		return undefined
	}

	parser.get_byte()

	return string
}


function parse_preprocessor_include_token(parser)
{
	var string
	var format_close_brace

	parser.skip_spaces()

	if(parser.head=='<')
		format_close_brace='>'
	else if(parser.head=='"')
		format_close_brace='"'
	else
	{
		console.log(parser.head)
		console.log('expected < or "')
		return true
	}

	string=get_string(parser, format_close_brace)

	if(!string)
		return true

	console.log('#include '+string)
}