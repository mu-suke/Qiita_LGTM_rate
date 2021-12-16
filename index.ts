const main = () => {
  // シートIDとシート名を指定
  // 参照: https://qiita.com/chihiro/items/3e1d17b78676c6a39d24
  const spreadsheet = SpreadsheetApp.openById('Write your sheet ID')
  const sheet = spreadsheet.getSheetByName('Write your sheet name')

  // アクセストークンをGASのプロパティストアに保存
  // 参照: https://tonari-it.com/gas-property-store/
  const ACCESS_TOKEN =
    PropertiesService.getScriptProperties().getProperty('QIITA_ACCESS_TOKEN')

  // 1つ目のAPIコール
  const resp = UrlFetchApp.fetch(
    'https://qiita.com/api/v2/users/{Write your user ID}/items',
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    }
  )
  const json = JSON.parse(resp.toString())

  // 上のAPIだとpage_views_countがnullになるため記事ごとにAPIを叩く必要がある
  json.map((data: any) => {
    // 2つ目のAPIコール
    const pageViewRespRaw = UrlFetchApp.fetch(
      `https://qiita.com/api/v2/items/${data['id']}`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    )
    const pageViewResp = JSON.parse(pageViewRespRaw.toString())

    // スプレッドシート上に保存
    sheet?.appendRow([
      data['title'],
      pageViewResp['page_views_count'],
      data['likes_count'],
      data['created_at'],
      data['url'],
    ])
  })
}
