import dash
from dash import dcc, html, dash_table
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import pandas as pd

uri = "mongodb+srv://admin:G0%40tDesEchecs@dbrfid.ojrspq8.mongodb.net/?retryWrites=true&w=majority&appName=DBRFID"
client = MongoClient(uri, server_api=ServerApi('1'))
collection = client["mes_rfid"]["rfid_events"]

pipeline = [
    {"$sort": {"timestamp": -1}}, 
    {"$group": {
        "_id": "$uuid",
        "last_step": {"$first": "$step_name"},
        "last_time": {"$first": "$timestamp"}
    }}
]
results = list(collection.aggregate(pipeline))

# Transformation en DataFrame
df = pd.DataFrame(results)
df.rename(columns={
    "_id": "UUID",
    "last_step": "Current Step",
    "last_time": "Last Scan"
}, inplace=True)

app = dash.Dash(__name__)
app.title = "RFID Dashboard"

app.layout = html.Div(style={"fontFamily": "Arial", "padding": "20px"}, children=[
    html.H1("Dashboard", style={"color": "#1c1c1c"}),

    html.Div([
        html.H3(f"Products currently in process: {len(df)}"),
    ], style={"marginBottom": "20px"}),

    dash_table.DataTable(
        data=df.to_dict('records'),
        columns=[{"name": i, "id": i} for i in df.columns],
        style_table={"overflowX": "auto"},
        style_cell={"textAlign": "left", "padding": "5px"},
        style_header={
            "backgroundColor": "#2613e5",
            "fontWeight": "bold",
            "color": "#1c1c1c"
        },
    )
])

if __name__ == '__main__':
    app.run(debug=True)
