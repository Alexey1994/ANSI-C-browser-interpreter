function is_number(char)
{
	if(char>='0' && char<='9')
		return true

	return false
}


function is_letter(char)
{
	if((char>='a' && char<='z') || (char>='A' && char<='Z'))
		return true
	
	return false
}


function is_space(char)
{
	if(char==' ' || char=='\n' || char=='\r' || char=='\t')
		return 1

	return 0
}