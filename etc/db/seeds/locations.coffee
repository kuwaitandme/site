exports.seed = (knex, Promise) ->
  _ins = (id, name="") ->
    values =
      slug: name.toLowerCase().replace(/&/g, "").replace /[,\s]+/g, "-"
      name: name
    if id? then values.id = id
    (knex "locations").insert values

  Promise.join(
    # Deletes ALL existing entries
    knex("locations").del(),

    (_ins 0, "None"),
    (_ins null, "Abdullah Al-Salem"),
    (_ins null, "Abraq Khaitan"),
    (_ins null, "Abu Fteira"),
    (_ins null, "Abu Halifa"),
    (_ins null, "Adiliya"),
    (_ins null, "Adan"),
    (_ins null, "Ahmadi"),
    (_ins null, "Al-Jabriya"),
    (_ins null, "Al-Zour"),
    (_ins null, "Andalus"),
    (_ins null, "Ardiyah"),
    (_ins null, "Bayan"),
    (_ins null, "Bayan"),
    (_ins null, "Bi-di"),
    (_ins null, "Bnied Al-Gar"),
    (_ins null, "Daiya"),
    (_ins null, "Dasman"),
    (_ins null, "Doha"),
    (_ins null, "Fahaheel"),
    (_ins null, "Faiha"),
    (_ins null, "Fardaws"),
    (_ins null, "Farwaniyah"),
    (_ins null, "Fintas"),
    (_ins null, "Funaitīs"),
    (_ins null, "Ghirnata"),
    (_ins null, "Hadiya"),
    (_ins null, "Hawally"),
    (_ins null, "Hittin"),
    (_ins null, "Jabir al-Ahmad City"),
    (_ins null, "Jabriya"),
    (_ins null, "Jahra"),
    (_ins null, "Jibla"),
    (_ins null, "Jleeb Al-Shuyoukh"),
    (_ins null, "Keifan"),
    (_ins null, "Khaitan"),
    (_ins null, "Khaldiya"),
    (_ins null, "Kuwait City"),
    (_ins null, "Mahboula"),
    (_ins null, "Maidan Hawalli"),
    (_ins null, "Mangaf"),
    (_ins null, "Mansouriya"),
    (_ins null, "Mirgab"),
    (_ins null, "Mishref"),
    (_ins null, "Misila"),
    (_ins null, "Mubarak aj-Jabir suburb"),
    (_ins null, "Mubarak al-Kabeer"),
    (_ins null, "Nahdha"),
    (_ins null, "Nigra"),
    (_ins null, "Nuzha"),
    (_ins null, "Omariya"),
    (_ins null, "Qadsiya"),
    (_ins null, "Qurain"),
    (_ins null, "Qurtuba"),
    (_ins null, "Qusur"),
    (_ins null, "Rabiya"),
    (_ins null, "Rai"),
    (_ins null, "Rawdah"),
    (_ins null, "Riqqah"),
    (_ins null, "Rumaithiya"),
    (_ins null, "Sabah Al-Nasser"),
    (_ins null, "Sabah Al-Salem"),
    (_ins null, "Sabahiyah"),
    (_ins null, "Sabhan"),
    (_ins null, "Salhiya"),
    (_ins null, "Salmiya"),
    (_ins null, "Salwa"),
    (_ins null, "Sawabir"),
    (_ins null, "Sha-ab"),
    (_ins null, "Shammiya"),
    (_ins null, "Sharq"),
    (_ins null, "Shuwaikh"),
    (_ins null, "Sulaibikhat"),
    (_ins null, "Surra"),
    (_ins null, "Udailiya"),
    (_ins null, "Wafra"),
    (_ins null, "Yarmuk")
  )