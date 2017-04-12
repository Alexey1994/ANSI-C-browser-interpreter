function parse_print_token(parser)
{
	var expression

	do
	{
		parser.skip()
		expression=parse_expression(parser)

		console.log(expression)

		if(!expression)
			return true

		parser.body.push({
			type: PRINT,
			data: expression
		})
	}
	while(parser.head===',' && !parser.end_of_data())
}