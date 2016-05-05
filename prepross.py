# coding: utf8

import pandas as pd
import numpy as np

def to_csv(dfs, filename):
	dfs.to_csv(filename, index=False)

	return

def remove_max_val(dfs):
	result_df = []
	for df in dfs:
		max_hpcp = df.HPCP.max()
		i_max = df[df.HPCP == max_hpcp].index
		new_df = df.drop(i_max)

		result_df.append(new_df)

	return result_df

def split_day_hour(dfs):

	date_split = dfs.DATE.str.split(' ').apply(pd.Series, 1)
	date_split.columns = ['DAY', 'HOUR']

	dfs = dfs.drop('DATE', axis=1)
	dfs = pd.concat([dfs, date_split], axis=1)

	return dfs

def remove_max(dfs):
	# j'enlève les valeurs maximales (incoherentes) 
	max_hpcp = dfs.HPCP.max()

	i_max = dfs[dfs.HPCP == max_hpcp].index

	dfs = dfs.drop(i_max)

	return dfs

def split_ymd(dfs):
	day = dfs.DAY

	year_month_day = day.str.extract('(\d{4})(\d{2})(\d{2})')
	year_month_day.columns = ['YEAR', 'MONTH', 'DAY']

	dfs = dfs.drop('DAY', axis=1)

	dfs = pd.concat([dfs, year_month_day], axis=1)
		# df1.to_csv('728915_mod.csv', index=False)
		# groupby = temp.groupby(['STATION', 'STATION_NAME', 'LATITUDE', 'LONGITUDE', 'DAY'], as_index=False)['HPCP'].aggregate(np.mean)

	return dfs

def group_by_sum(dfs, names):

	dfs = dfs.groupby(names, as_index=False)['HPCP'].sum()

	return dfs

df1 = pd.read_csv('data/728915.csv')
df2 = pd.read_csv('data/728920.csv')
df3 = pd.read_csv('data/728921.csv')

new_dfs = remove_max_val([df1, df2, df3])

df_total = pd.concat(new_dfs, ignore_index=True)

df_total.HPCP = df_total.HPCP.multiply(2.54)


# df_total = remove_max(df_total)

df_total = split_day_hour(df_total)
df_total = split_ymd(df_total)


names = ['STATION', 'STATION_NAME', 'ELEVATION', 'LATITUDE', 'LONGITUDE', 'YEAR', 'MONTH', 'DAY']
df_total = group_by_sum(df_total, names)

filename = 'cal_data_day.csv'
to_csv(df_total, filename)
