const unary_operations=[ '-',  '~' ]
const binary_operations=['+', '-', '/', '*']


const priorities={
	'(': 0,
	'|': 1,
	'^': 2,
	'&': 3,

	'=': 4, //==
	'!': 4, //!=

	'+': 6,
	'-': 6,
	'%': 7,
	'*': 7,
	'/': 7
}


function parse_expression(parser)
{
	function parse_operand()
	{
		function parse_number()
		{
			var number=""

			do
			{
				number=number+parser.head
				parser.get_byte()
			}
			while(is_number(parser.head) && !parser.end_of_data())

			expression.push({
				data:{
					operand_type: NUMBER,
					operand_data: parseInt(number, 10)
				},

				type: OPERAND
			})
		}


		if(is_letter(parser.head))
			expression.push({
				data:{
					operand_type: VARIABLE,
					operand_data: parser.get_token()
				},

				type: OPERAND
			})

		else if(is_number(parser.head))
			parse_number()
	}


	function add_operation(operation)
	{
		if(!stack.length || priorities[stack[stack.length-1]] < priorities[operation])
			stack.push(operation)
		else
		{
			while(stack.length && priorities[stack[stack.length-1]] >= priorities[operation])
				expression.push({
					data: stack.pop(),
					type: OPERATION
				})

			stack.push(operation)
		}
	}


	function stack_contains_open_gap()
	{
		for(var i in stack)
			if(stack[i]=='(')
				return true
	}


	var expression=[]
	var stack=[]

	var is_expression=true
	var is_operation=false
	var is_close_gap=false

	var is_unary_operation

	while(is_expression && !parser.end_of_data())
	{
		if(!is_close_gap)
		do
		{
			parser.skip()
			is_unary_operation=false

			for(var i in unary_operations)
			{
				if(parser.head===unary_operations[i])
				{
					add_operation(parser.head)
					is_unary_operation=true
				}
			}
		}
		while(is_unary_operation)

		if(parser.head!=='(' && !is_close_gap)
		{
			if(parse_operand())
				return undefined

			is_operation=0
		}

		parser.skip()

		switch(parser.head)
		{
			case '(':
				stack.push('(')
				parser.get_byte()

				is_operation=true
				is_close_gap=false
				break;

			case ')':
				if(!stack_contains_open_gap())
				{
					is_expression=false
					break
				}

				if(stack[stack.length-1]=='(')
				{
					console.log("скобки без выражения")
					return undefied
				}

				do
				{
					if(!stack.length)
					{
						console.log("отсутствует (");
						return undefined
					}

					expression.push({
						data: stack.pop(),
						type:OPERATION
					})
				}
				while(stack[stack.length-1]!='(')

				stack.pop()
				parser.get_byte()

				is_operation=false
				is_close_gap=true
				break;

			default:
				is_expression=false

				for(var i in binary_operations)
				{
					if(parser.head===binary_operations[i])
					{
						if(is_operation)
						{
							console.log("2 операции без опранда")
							return undefined
						}

						add_operation(binary_operations[i])

						parser.get_byte()

						is_operation=true
	                    is_close_gap=false
	                    is_expression=true

	                    break
					}
				}
		}

		parser.skip()
	}

	while(stack.length)
	{
		var operation=stack.pop()

		if(operation=='(')
		{
			console.log("отсутствует )")
			return undefined
		}

		expression.push({
			data: operation,
			type: OPERATION
		})
	}

	if(!expression.length)
	{
		console.log("отсутствует выражение")
		return undefined
	}
	
	return expression
}