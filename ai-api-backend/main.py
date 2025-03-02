from flask import Flask, jsonify, request
import yfinance as yf
from datetime import date

app = Flask(__name__)

# Define the function to calculate the Market Mood Index (MMI)


def calculate_market_mood_index(stock_symbol, start_date, end_date):
    try:
        # Fetch historical data using yfinance
        data = yf.download(stock_symbol, start=start_date, end=end_date)
        if data.empty:
            return {"error": "No data found for the given symbol and date range."}

        # Calculate daily percentage change
        data['Daily Change (%)'] = data['Close'].pct_change() * 100

        # Define the mood based on daily percentage change
        def mood(change):
            if change > 0.5:
                return 'Positive'
            elif change < -0.5:
                return 'Negative'
            else:
                return 'Neutral'

        data['Mood'] = data['Daily Change (%)'].apply(mood)

        # Calculate mood percentages
        mood_summary = data['Mood'].value_counts(normalize=True) * 100

        return mood_summary.to_dict()

    except Exception as e:
        return {"error": str(e)}

# Define the Flask route


@app.route('/mmi', methods=['POST'])
def post_market_mood_index():
    try:
        # Parse JSON body
        body = request.get_json()
        stock_symbol = body.get('symbol', '^BSESN')  # Default to Sensex symbol
        start_date = body.get('start_date')  # Custom start date
        end_date = body.get('end_date')  # Custom end date

        if not start_date or not end_date:
            return jsonify({"error": "Please provide both start_date and end_date in the JSON body."}), 400

        # Call the function to calculate the MMI
        result = calculate_market_mood_index(
            stock_symbol, start_date, end_date)

        # Return the result as JSON
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
