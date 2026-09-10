<?xml version="1.0" encoding="UTF-8"?>
<!--
  Hoja de estilo del mapa del sitio.

  El mapa es para los buscadores, no para las personas: un navegador que abre
  un XML sin hoja de estilo muestra una sopa de texto sin etiquetas, y parece
  que algo está roto cuando no lo está. Esto lo pinta como una tabla legible.

  A Google le da igual: lee el XML, no esta hoja.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">

<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<xsl:template match="/">
<html lang="es-CR">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Mapa del sitio · AzuMar</title>
  <style>
    :root{--navy:#001A3E;--navy-2:#0F2A52;--gold:#D6A93B;--gold-soft:#E8C978;--paper:#F4EFE4}
    *{box-sizing:border-box;margin:0;padding:0}
    body{
      background:var(--navy);color:var(--paper);
      font-family:"Avenir Next","Segoe UI",system-ui,-apple-system,Roboto,Helvetica,Arial,sans-serif;
      padding:28px 20px 60px;line-height:1.55;
    }
    .caja{max-width:900px;margin:0 auto}
    h1{font-size:clamp(21px,5vw,28px);font-weight:700;margin-bottom:6px}
    .sub{color:rgba(244,239,228,.65);font-size:14.5px;margin-bottom:6px}
    .nota{
      margin:18px 0 26px;padding:13px 16px;
      background:rgba(214,169,59,.08);border-left:3px solid var(--gold);
      border-radius:0 10px 10px 0;font-size:14px;color:var(--gold-soft);
    }
    .envoltorio{overflow-x:auto;-webkit-overflow-scrolling:touch}
    table{border-collapse:collapse;width:100%;min-width:520px;font-size:14.5px}
    th{
      text-align:left;padding:10px 12px;
      font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;
      color:var(--gold);border-bottom:1px solid rgba(214,169,59,.35);
      white-space:nowrap;
    }
    td{padding:11px 12px;border-bottom:1px solid rgba(244,239,228,.09);vertical-align:top}
    tr:hover td{background:var(--navy-2)}
    a{color:var(--gold-soft);text-decoration:none;word-break:break-all}
    a:hover{text-decoration:underline}
    .chica{color:rgba(244,239,228,.5);font-size:13px;white-space:nowrap}
    .total{margin-top:22px;font-size:13.5px;color:rgba(244,239,228,.5)}
  </style>
</head>
<body>
  <div class="caja">
    <h1>Mapa del sitio</h1>
    <p class="sub">Restaurante y Marisquería AzuMar · Quepos, Costa Rica</p>

    <p class="nota">
      Esta lista es para los buscadores: les dice qué páginas existen y en qué
      idiomas. No hace falta hacer nada con ella.
    </p>

    <div class="envoltorio">
      <table>
        <tr>
          <th>Página</th>
          <th>Actualizada</th>
          <th>Revisar</th>
          <th>Peso</th>
        </tr>
        <xsl:for-each select="s:urlset/s:url">
          <tr>
            <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
            <td class="chica"><xsl:value-of select="s:lastmod"/></td>
            <td class="chica"><xsl:value-of select="s:changefreq"/></td>
            <td class="chica"><xsl:value-of select="s:priority"/></td>
          </tr>
        </xsl:for-each>
      </table>
    </div>

    <p class="total">
      <xsl:value-of select="count(s:urlset/s:url)"/> páginas en total.
    </p>
  </div>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
