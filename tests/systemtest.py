from selenium import webdriver
from selenium.webdriver.common.by import By
import unittest, os, time
from app import app, database
from datetime import datetime

class SystemTest(unittest.TestCase):
    driver = None

    def setUp(self):
        if os.path.exists("minecraftle.db"):
            os.remove("minecraftle.db")
        self.driver = webdriver.Firefox(executable_path=os.path.join("tests",'geckodriver'))
        if not self.driver:
            self.skipTest('Web browser not available')
        else:
            database.create_table()
            database.insert_record("1", datetime.today(), 1, 5)
            database.insert_record("2", datetime.today(), 1, 6)
            database.insert_record("3", datetime.today(), 1, 2)
            database.insert_record("4", datetime.today(), 0, 10)
            database.insert_record("5", datetime.today(), 0, 10)
            database.insert_record("6", datetime.today(), 1, 10)

            self.driver.maximize_window()
            self.driver.get('http://localhost:5000/')

    def tearDown(self):
        if self.driver:
            self.driver.close()

    def test_record_retrieval(self):
        wins, games_played, user_attempt_wincounts = database.get_records("1")
        self.assertEqual(len(wins), 4)
        self.assertEqual(games_played,[(1,)])
        self.assertEqual(user_attempt_wincounts,[(5, 1)])

    def test_lose_submission(self):
        for i in range(10):
            solutionslot = self.driver.find_element(By.ID, "solutiondiv"+str(i))
            solutionslot.click()
        time.sleep(3)
        submit = self.driver.find_element(By.ID, "popupStatsButton")
        submit.click()

        self.driver.implicitly_wait(3)
        ranking = self.driver.find_element(By.XPATH, "//table/tbody/tr/td[2]")
        self.assertEqual(ranking.text, "N/A")
        wins = self.driver.find_element(By.XPATH, "//table/tbody/tr[2]/td[2]")
        self.assertEqual(wins.text, "0")
        losses = self.driver.find_element(By.XPATH, "//table/tbody/tr[3]/td[2]")
        self.assertEqual(losses.text, "1")

    def test_win_submission(self):
        self.driver.get("http://localhost:5000/stats/7?win=1&attempts=1")
        ranking = self.driver.find_element(By.XPATH, "//table/tbody/tr/td[2]")
        self.assertEqual(ranking.text, "1/5")
        wins = self.driver.find_element(By.XPATH, "//table/tbody/tr[2]/td[2]")
        self.assertEqual(wins.text, "1")
        losses = self.driver.find_element(By.XPATH, "//table/tbody/tr[3]/td[2]")
        self.assertEqual(losses.text, "0")

    def test_malformed_submission(self):
        self.driver.get("http://localhost:5000/stats/8?win=45sdsdc0&attempts=3djnsdd")
        ranking = self.driver.find_element(By.XPATH, "//table/tbody/tr/td[2]")
        self.assertEqual(ranking.text, "N/A")
        wins = self.driver.find_element(By.XPATH, "//table/tbody/tr[2]/td[2]")
        self.assertEqual(wins.text, "0")
        losses = self.driver.find_element(By.XPATH, "//table/tbody/tr[3]/td[2]")
        self.assertEqual(losses.text, "0")

    def test_stats_output(self):
        self.driver.get("http://localhost:5000/stats/3")
        ranking = self.driver.find_element(By.XPATH, "//table/tbody/tr/td[2]")
        self.assertEqual(ranking.text, "1/4")
        wins = self.driver.find_element(By.XPATH, "//table/tbody/tr[2]/td[2]")
        self.assertEqual(wins.text, "1")
        losses = self.driver.find_element(By.XPATH, "//table/tbody/tr[3]/td[2]")
        self.assertEqual(losses.text, "0")
     



if __name__ == "__main__":
    unittest.main(verbosity=2)