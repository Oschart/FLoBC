import bnlearn as bn

# Load example mixed dataset
df = bn.import_example(data='titanic')

# Convert to onehot
dfhot, dfnum = bn.df2onehot(df)

# Structure learning
# model = bn.structure_learning.fit(dfnum, methodtype='cl', black_list=['Embarked','Parch','Name'], root_node='Survived', bw_list_method='nodes')
model = bn.structure_learning.fit(dfnum)
# Plot
G = bn.plot(model, interactive=False)

# Compute edge strength with the chi_square test statistic
model = bn.independence_test(model, dfnum, test='chi_square', prune=True)
# Plot
bn.plot(model, interactive=False, pos=G['pos'])

# Parameter learning
model = bn.parameter_learning.fit(model, dfnum)