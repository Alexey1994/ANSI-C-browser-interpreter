function parse_typedef(parser)
{

}


var tokens = {
	"typedef": parse_typedef
}


function parse_line(parser)
{
	var line = ''

/*
	while(!parser.end_of_data() && parser.head() != ';')
	{
		line += parser.head()
		parser.read_byte()
	}*/

	parser.read_byte()

	console.log('line: ' + line)

	return 1
}