declare @codpersona int
	DECLARE comentarios CURSOR FOR 

		select codpersona from personas order by codpersona desc

	OPEN comentarios;
	FETCH NEXT FROM comentarios INTO @codpersona;
	WHILE @@FETCH_STATUS = 0
		BEGIN

update personas set referenciascalculadas = dbo.fun_CommentsAsText(codPersona) where codpersona = @codPersona

	FETCH NEXT FROM comentarios INTO @codpersona;

end