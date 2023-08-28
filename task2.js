// Questions
// Tasks:
// - What are the problems
// - Provide the new refactored code describing the reason you followed your
// implementation.
/*
given code to be refactored
*/
app.get('/product/:productId', (req, res) => {
  db.query(
    `SELECT * FROM products WHERE id=${req.params.productId}`,
    (err, result) => {
      if (err) throw err;
      res.send(result);
    },
  );
});

// Answer
// 1, the problem about the earlier pasted code is that it has a security
// vulnerability known as "SQL Injection. Also it select all field in the
// product table which can cause an increase in  network traffic and reduce
// performance, it is a best practice to select the field needed.

//  To mitigate that, one can use parameterized queries so as to make sure
//  that everything sent down is treated as a parameter

// 2. refactored code

app.get('/product/:productId', async (req, res) => {
  const productId = req.params.productId;
  try {
    const response = await db.query(
      'SELECT id, name, price FROM products WHERE id = ?',
      [productId],
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send('Internal Server Error');
  }
});
